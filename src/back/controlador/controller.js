const { db } = require("../configuracion/firebaseAdmin");

// =======================
// Helpers
// =======================
const userDocRef = (uid) => db.collection("users").doc(uid);
const usernameDocRef = (uname) => db.collection("usernames").doc(uname);

function normalizeUsername(u) {
  return (u || "").trim().toLowerCase();
}

// Regla de username: 3-20, a-z 0-9 _
function validateUsername(u) {
  return /^[a-z0-9_]{3,20}$/.test(u);
}

// =======================
// Scaffold inicial de usuario
// =======================
async function ensureUserScaffold(uid, email) {
  const ref = userDocRef(uid);
  const snap = await ref.get();
  const now = new Date();

  if (!snap.exists) {
    // users/{uid}
    await ref.set({
      uid,
      email: email || null,
      displayName: null,
      user: null, // username
      profilePicture: "/imagenes/avatares/avatar-en-blanco.webp",
      role: "user",
      language: "es",
      createdAt: now,
      lastActiveAt: now,
      onboardingCompleted: false,
    });

    // users/{uid}/preferences/main
    await ref.collection("preferences").doc("main").set({
      categories: [],
      tags: [],
      budget: { currency: "EUR", min: 0, max: 0 },
      distanceKm: 10,
      availability: {
        weekdays: true,
        weekends: true,
        morning: true,
        afternoon: true,
        evening: true,
      },
      constraints: { avoidTags: [], accessibilityNeeds: [] },
      updatedAt: now,
    });

    // users/{uid}/privacy/main
    await ref.collection("privacy").doc("main").set({
      consent: { analytics: true, personalization: true },
      dataRetentionDays: 180,
      updatedAt: now,
    });

    // users/{uid}/recommendation_state/main
    await ref.collection("recommendation_state").doc("main").set({
      topCategories: {},
      topTags: {},
      recentItemRefs: [],
      negativeSignals: { dismissedTags: {} },
      coldStart: true,
      lastRecommendation: null,
      updatedAt: now,
    });
  } else {
    await ref.update({ lastActiveAt: now });
  }
}

// =======================
// Controllers
// =======================

// ✅ POST /api/bootstrap (requireAuth)
const bootstrapUser = async (req, res) => {
  try {
    const { uid, email } = req.auth;
    await ensureUserScaffold(uid, email);

    const snap = await userDocRef(uid).get();
    return res.json({ ok: true, user: snap.data() });
  } catch (error) {
    console.error("❌ Error en bootstrapUser:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// ✅ GET /api/perfil (requireAuth)
const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.auth;

    const snap = await userDocRef(uid).get();
    if (!snap.exists) return res.status(404).json({ message: "Usuario no encontrado" });

    return res.json(snap.data());
  } catch (error) {
    console.error("❌ Error en getUserProfile:", error);
    return res.status(500).json({ message: "Error al obtener el perfil" });
  }
};

// ✅ PUT /api/perfil (requireAuth)
// Incluye username único con colección usernames/{username}
// Opción B: si cambias username, libera el anterior
const updateUserProfile = async (req, res) => {
  try {
    const { uid } = req.auth;
    const { user, profilePicture, displayName, language } = req.body;

    const now = new Date();
    const ref = userDocRef(uid);

    // 1) Username único (si viene en el body)
    if (user !== undefined) {
      const newUname = normalizeUsername(user);

      if (!newUname) {
        return res.status(400).json({ message: "El nombre de usuario es obligatorio" });
      }
      if (!validateUsername(newUname)) {
        return res.status(400).json({
          message: "El nombre de usuario debe tener 3-20 caracteres y solo a-z, 0-9, _",
        });
      }

      await db.runTransaction(async (tx) => {
        const userSnap = await tx.get(ref);
        if (!userSnap.exists) throw new Error("Usuario no encontrado");

        const currentUname = userSnap.data().user ? normalizeUsername(userSnap.data().user) : null;

        // si es el mismo, no tocar índice
        if (currentUname !== newUname) {
          const newRef = usernameDocRef(newUname);
          const newSnap = await tx.get(newRef);

          // Ocupado por otro uid
          if (newSnap.exists && newSnap.data().uid !== uid) {
            throw new Error("El nombre de usuario ya está en uso");
          }

          // Reservar nuevo
          tx.set(newRef, { uid, createdAt: now }, { merge: true });

          // Liberar anterior (Opción B)
          if (currentUname) {
            const oldRef = usernameDocRef(currentUname);
            const oldSnap = await tx.get(oldRef);
            if (oldSnap.exists && oldSnap.data().uid === uid) {
              tx.delete(oldRef);
            }
          }

          // Guardar username en perfil
          tx.set(ref, { user: newUname }, { merge: true });
        }

        // lastActiveAt dentro de la transacción
        tx.set(ref, { lastActiveAt: now }, { merge: true });
      });
    }

    // 2) Actualizaciones normales del perfil
    const patch = {};
    if (profilePicture !== undefined) patch.profilePicture = profilePicture;
    if (displayName !== undefined) patch.displayName = displayName;
    if (language !== undefined) patch.language = language;

    patch.lastActiveAt = now;

    await ref.set(patch, { merge: true });

    const snap = await ref.get();
    return res.json(snap.data());
  } catch (error) {
    console.error("❌ Error en updateUserProfile:", error);
    const msg = error?.message || "Error al actualizar el perfil";

    // username ocupado o inválido -> 400 (para UI)
    if (
      msg.toLowerCase().includes("usuario") ||
      msg.toLowerCase().includes("uso") ||
      msg.toLowerCase().includes("caracter")
    ) {
      return res.status(400).json({ message: msg });
    }

    return res.status(500).json({ message: "Error al actualizar el perfil" });
  }
};

// ✅ GET /api/usuarios (admin)
// Nota: tu ruta debe tener requireAdmin
const getAllUsers = async (req, res) => {
  try {
    const q = await db
      .collection("users")
      .select("uid", "user", "displayName", "profilePicture", "role", "email")
      .get();

    const usuarios = q.docs.map((d) => d.data());
    return res.json(usuarios);
  } catch (error) {
    console.error("❌ Error en getAllUsers:", error);
    return res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

// ✅ GET /api/usuarios/:id/resumen (admin o servicio interno)
const getUserResumen = async (req, res) => {
  try {
    const { id } = req.params; // uid
    const snap = await userDocRef(id).get();
    if (!snap.exists) return res.status(404).json({ message: "Usuario no encontrado" });

    const data = snap.data();
    return res.json({
      uid: data.uid,
      user: data.user,
      profilePicture: data.profilePicture,
      role: data.role,
      email: data.email,
    });
  } catch (error) {
    console.error("❌ Error en getUserResumen:", error);
    return res.status(500).json({ message: "Error al obtener datos del usuario" });
  }
};

module.exports = {
  bootstrapUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserResumen,
};

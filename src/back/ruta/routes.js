const express = require("express");
const router = express.Router();

const requireAuth = require("../middelware/requireAuth");
const requireAdmin = require("../middelware/requireAdmin");

const { admin } = require("../configuracion/firebaseAdmin");

// ✅ Contacto
const { enviarContacto } = require("../controlador/contactoController");

// ✅ Nodemailer transporter
const transporter = require("../configuracion/email");

const {
  getAllUsers,
  getUserResumen,
} = require("../controlador/controller");

// DEBUG ping para confirmar que este router está montado
router.get("/__ping", (_req, res) =>
  res.json({ ok: true, router: "users-routes" })
);

// Health
router.get("/health", (_req, res) => res.json({ ok: true, service: "users" }));

// ✅ Contacto
router.post("/contacto", enviarContacto);

// ✅ Email bienvenida
router.post("/email/bienvenida", requireAuth, async (req, res) => {
  try {
    const uid = req.auth?.uid;
    if (!uid) return res.status(401).json({ message: "No autorizado" });

    const { name } = req.body;

    // Email real desde Firebase Admin
    const userRecord = await admin.auth().getUser(uid);
    const toEmail = userRecord.email;

    if (!toEmail) {
      return res.status(400).json({ message: "Email no disponible" });
    }

    await transporter.sendMail({
      from: `"Planzo" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "¡Registro completado!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="margin: 0 0 12px;">¡Bienvenido${name ? `, ${name}` : ""}! 🎉</h2>
          <p>Tu registro se ha completado con éxito.</p>
          <p>Te hemos enviado un correo para verificar tu cuenta (revisa también spam).</p>
          <p style="margin-top: 18px; color: #666;">— Equipo Planzo</p>
        </div>
      `,
    });

    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ Error email bienvenida:", e);
    return res.status(500).json({ message: "Error enviando email de bienvenida" });
  }
});

// =====================
// PERFIL (Firestore) — TODO EN ESTE ROUTER
// =====================

// POST /api/bootstrap (auth)
// Crea users/{uid} si no existe
router.post("/bootstrap", requireAuth, async (req, res) => {
  try {
    const uid = req.auth?.uid;
    if (!uid) return res.status(401).json({ message: "No autorizado" });

    const userRecord = await admin.auth().getUser(uid);
    const email = userRecord.email || null;

    const ref = admin.firestore().collection("users").doc(uid);
    const snap = await ref.get();

    if (!snap.exists) {
      await ref.set({
        uid,
        email,
        displayName: userRecord.displayName || "",
        user: "",
        avatarUrl: userRecord.photoURL || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await ref.set(
        { updatedAt: admin.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ bootstrap error:", e);
    return res.status(500).json({ message: "Error en bootstrap" });
  }
});

// GET /api/perfil (auth)
// Devuelve perfil desde Firestore + fallback Auth
router.get("/perfil", requireAuth, async (req, res) => {
  try {
    const uid = req.auth?.uid;
    if (!uid) return res.status(401).json({ message: "No autorizado" });

    const userRecord = await admin.auth().getUser(uid);

    const ref = admin.firestore().collection("users").doc(uid);
    const snap = await ref.get();
    const data = snap.exists ? snap.data() : {};

    const isAdmin = req.auth?.admin === true;

    const avatarUrl =
      data?.avatarUrl ||
      data?.profilePicture || // compat si guardaste antes con otro nombre
      userRecord.photoURL ||
      "";

    return res.json({
      uid,
      email: userRecord.email || data?.email || "",
      displayName: data?.displayName || userRecord.displayName || "",
      user: data?.user || "",
      avatarUrl,
      isAdmin,
    });
  } catch (e) {
    console.error("❌ get perfil error:", e);
    return res.status(500).json({ message: "Error al obtener perfil" });
  }
});

// PUT /api/perfil (auth)
// Actualiza perfil en Firestore (displayName/user/avatarUrl)
router.put("/perfil", requireAuth, async (req, res) => {
  try {
    const uid = req.auth?.uid;
    if (!uid) return res.status(401).json({ message: "No autorizado" });

    const { displayName, user, avatarUrl } = req.body;

    if (displayName !== undefined && typeof displayName !== "string") {
      return res.status(400).json({ message: "displayName inválido" });
    }
    if (user !== undefined && typeof user !== "string") {
      return res.status(400).json({ message: "user inválido" });
    }
    if (avatarUrl !== undefined && typeof avatarUrl !== "string") {
      return res.status(400).json({ message: "avatarUrl inválido" });
    }

    const patch = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (displayName !== undefined) patch.displayName = displayName;
    if (user !== undefined) patch.user = user;
    if (avatarUrl !== undefined) patch.avatarUrl = avatarUrl;

    const ref = admin.firestore().collection("users").doc(uid);
    await ref.set(patch, { merge: true });

    // (Opcional recomendado) sincroniza displayName en Auth
    if (typeof displayName === "string") {
      await admin.auth().updateUser(uid, { displayName });
    }

    return res.json({
      ok: true,
      uid,
      displayName: displayName ?? undefined,
      user: user ?? undefined,
      avatarUrl: avatarUrl ?? undefined,
    });
  } catch (e) {
    console.error("❌ put perfil error:", e);
    return res.status(500).json({ message: "Error al actualizar perfil" });
  }
});

// =====================
// ADMIN
// =====================
router.get("/usuarios", requireAdmin, getAllUsers);
router.get("/usuarios/:id/resumen", requireAdmin, getUserResumen);

// =====================
// FAVORITOS
// =====================
function parseFiestaId(raw) {
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

function favDocRef(uid, fiestaId) {
  return admin
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("saved_items")
    .doc(`fiesta_${fiestaId}`);
}

// LISTA: GET /api/favoritos
router.get("/favoritos", requireAuth, async (req, res) => {
  try {
    const uid = req.auth?.uid;
    if (!uid) return res.status(401).json({ message: "No autorizado" });

    const qs = await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("saved_items")
      .where("kind", "==", "fiesta")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    const items = qs.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.json({ items });
  } catch (e) {
    console.error("LIST favoritos error:", e);
    return res.status(500).json({ message: "Error listando favoritos" });
  }
});

// GET /api/favoritos/:fiestaId
router.get("/favoritos/:fiestaId", requireAuth, async (req, res) => {
  try {
    const uid = req.auth?.uid;
    const fiestaId = parseFiestaId(req.params.fiestaId);

    if (!uid) return res.status(401).json({ message: "No autorizado" });
    if (!fiestaId) return res.status(400).json({ message: "fiestaId inválido" });

    const snap = await favDocRef(uid, fiestaId).get();
    return res.json({ fiestaId, isFavorite: snap.exists });
  } catch (e) {
    console.error("GET favorito error:", e);
    return res.status(500).json({ message: "Error comprobando favorito" });
  }
});

// POST /api/favoritos/:fiestaId
router.post("/favoritos/:fiestaId", requireAuth, async (req, res) => {
  try {
    const uid = req.auth?.uid;
    const fiestaId = parseFiestaId(req.params.fiestaId);

    if (!uid) return res.status(401).json({ message: "No autorizado" });
    if (!fiestaId) return res.status(400).json({ message: "fiestaId inválido" });

    await favDocRef(uid, fiestaId).set(
      {
        kind: "fiesta",
        fiestaId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return res.status(201).json({ fiestaId, isFavorite: true });
  } catch (e) {
    console.error("POST favorito error:", e);
    return res.status(500).json({ message: "Error guardando favorito" });
  }
});

// DELETE /api/favoritos/:fiestaId
router.delete("/favoritos/:fiestaId", requireAuth, async (req, res) => {
  try {
    const uid = req.auth?.uid;
    const fiestaId = parseFiestaId(req.params.fiestaId);

    if (!uid) return res.status(401).json({ message: "No autorizado" });
    if (!fiestaId) return res.status(400).json({ message: "fiestaId inválido" });

    await favDocRef(uid, fiestaId).delete();
    return res.json({ fiestaId, isFavorite: false });
  } catch (e) {
    console.error("DELETE favorito error:", e);
    return res.status(500).json({ message: "Error eliminando favorito" });
  }
});

module.exports = router;
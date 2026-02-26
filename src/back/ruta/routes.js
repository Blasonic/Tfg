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
  bootstrapUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserResumen,
} = require("../controlador/controller");

// DEBUG ping para confirmar que este router está montado
router.get("/__ping", (_req, res) =>
  res.json({ ok: true, router: "users-routes" })
);

// Health
router.get("/health", (_req, res) => res.json({ ok: true, service: "users" }));


router.post("/contacto", enviarContacto);


router.post("/email/bienvenida", requireAuth, async (req, res) => {
  try {
    const uid = req.auth?.uid;
    if (!uid) return res.status(401).json({ message: "No autorizado" });

    const { name } = req.body;

    // Sacamos el email real desde Firebase Admin (seguro)
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
// USERS
// =====================
router.post("/bootstrap", requireAuth, bootstrapUser);

router.get("/perfil", requireAuth, getUserProfile);
router.put("/perfil", requireAuth, updateUserProfile);

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
    if (!fiestaId)
      return res.status(400).json({ message: "fiestaId inválido" });

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
    if (!fiestaId)
      return res.status(400).json({ message: "fiestaId inválido" });

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
    if (!fiestaId)
      return res.status(400).json({ message: "fiestaId inválido" });

    await favDocRef(uid, fiestaId).delete();
    return res.json({ fiestaId, isFavorite: false });
  } catch (e) {
    console.error("DELETE favorito error:", e);
    return res.status(500).json({ message: "Error eliminando favorito" });
  }
});

module.exports = router;
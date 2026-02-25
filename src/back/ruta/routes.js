const express = require("express");
const router = express.Router();



const requireAuth = require("../middelware/requireAuth");
const requireAdmin = require("../middelware/requireAdmin");

const { admin } = require("../configuracion/firebaseAdmin");

const {
  bootstrapUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserResumen,
} = require("../controlador/controller");

// DEBUG ping para confirmar que este router está montado
router.get("/__ping", (_req, res) => res.json({ ok: true, router: "users-routes" }));

// Health
router.get("/health", (_req, res) => res.json({ ok: true, service: "users" }));

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
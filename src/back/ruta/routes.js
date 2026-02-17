const express = require("express");
const router = express.Router();

const requireAuth = require("../middelware/requireAuth");
const requireAdmin = require("../middelware/requireAdmin");

const {
  bootstrapUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserResumen,
} = require("../controlador/controller");

// ✅ Se llama después de register/login en React (con Bearer token)
router.post("/bootstrap", requireAuth, bootstrapUser);

// ✅ Perfil
router.get("/perfil", requireAuth, getUserProfile);
router.put("/perfil", requireAuth, updateUserProfile);

// ✅ Admin
router.get("/usuarios", requireAdmin, getAllUsers);

// ✅ Para tu backend MySQL (usa uid)
router.get("/usuarios/:id/resumen", requireAdmin, getUserResumen);

module.exports = router;

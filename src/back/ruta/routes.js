const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserResumen
} = require('../controlador/controller');

// Rutas públicas
router.post('/Registro', registerUser);
router.post('/Login', loginUser);

// Rutas protegidas para perfil (opcional)
router.get('/perfil', getUserProfile);
router.put('/perfil', updateUserProfile);

// Rutas de usuarios
router.get('/usuarios', getAllUsers);

// 🟢 Ruta que necesita el backend de fiestas (MySQL)
router.get('/usuarios/:id/resumen', getUserResumen);

module.exports = router;

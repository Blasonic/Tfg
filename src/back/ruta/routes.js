const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controlador/controller');

const router = express.Router();

router.post('/Registro', registerUser);
router.post('/Login', loginUser);


router.get('/perfil', getUserProfile);
router.put('/perfil', updateUserProfile);

module.exports = router;

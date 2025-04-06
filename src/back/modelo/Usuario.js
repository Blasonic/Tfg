const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' } // Nueva propiedad para la foto de perfil
});

module.exports = mongoose.model('Usuario', UsuarioSchema);

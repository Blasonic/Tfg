const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  role: { type: String, default: 'user', enum: ['user', 'admin'] }  
});

module.exports = mongoose.model('Usuario', UsuarioSchema);


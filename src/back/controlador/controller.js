const Usuario = require('../modelo/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'Qca200@';


// ✅ Registro
const registerUser = async (req, res) => {
  try {
    const { name, user, email, password } = req.body;

    const emailExiste = await Usuario.findOne({ email });
    if (emailExiste) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const userExiste = await Usuario.findOne({ user });
    if (userExiste) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      name,
      user,
      email,
      password: hashedPassword,
      profilePicture: '/imagenes/avatares/avatar-en-blanco.webp',
      role: 'user'
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error("❌ Error en registerUser:", error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// ✅ Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) return res.status(400).json({ message: 'Correo o contraseña incorrectos' });

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(400).json({ message: 'Correo o contraseña incorrectos' });

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, role: usuario.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: usuario._id,
        name: usuario.name,
        email: usuario.email,
        user: usuario.user,
        profilePicture: usuario.profilePicture || '',
        role: usuario.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// ✅ Perfil
const getUserProfile = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id).select('-password');
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

// ✅ Actualizar perfil
const updateUserProfile = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { user, profilePicture } = req.body;

    const updatedUser = await Usuario.findByIdAndUpdate(
      decoded.id,
      { user, profilePicture },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('❌ Error en updateUserProfile:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

// ✅ Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, 'name user profilePicture');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

// ✅ NUEVO: Obtener resumen del usuario (para el backend de fiestas)
const getUserResumen = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('user profilePicture role');
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(usuario);
  } catch (error) {
    console.error('❌ Error en getUserResumen:', error);
    res.status(500).json({ message: 'Error al obtener datos del usuario' });
  }
};




module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserResumen // 👈 Exportado aquí
};
const admin = require("firebase-admin");

// Middleware para verificar token Firebase
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const token = header.split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    // guardamos datos del usuario para usar en controllers
    req.auth = decodedToken;

    next();
  } catch (error) {
    console.error("❌ Error en requireAuth:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

module.exports = requireAuth;

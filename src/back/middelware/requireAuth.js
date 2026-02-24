const admin = require("firebase-admin");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const token = header.split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    // claims completas
    req.auth = decodedToken;

    // acceso rápido al uid (estándar backend)
    req.user = { id: decodedToken.uid };

    next();
  } catch (error) {
    console.error("❌ Error en requireAuth:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

module.exports = requireAuth;
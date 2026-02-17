function requireAdmin(req, res, next) {
  if (!req.auth || !req.auth.admin) {
    return res.status(403).json({ message: "Acceso solo para administradores" });
  }
  next();
}

module.exports = requireAdmin;

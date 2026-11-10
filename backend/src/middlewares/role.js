function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
    if (!allowedRoles.includes(req.user.role?.code)) {
      return res.status(403).json({ error: 'Accès refusé (rôle insuffisant)' });
    }
    next();
  };
}

module.exports = { requireRole };
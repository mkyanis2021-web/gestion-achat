const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

async function auth(req, res, next) {
  try {
    const token =
      req.cookies?.access_token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : null);

    if (!token) return res.status(401).json({ error: 'Non authentifié' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.sub, {
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['password_hash'] },
    });

    if (!user || !user.actif)
      return res.status(401).json({ error: 'Compte inactif ou inexistant' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

module.exports = { auth };
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, Department } = require('../models');
const { logAudit } = require('../services/audit.service');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 8 * 60 * 60 * 1000,
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email et mot de passe requis' });

    const user = await User.findOne({
      where: { email },
      include: [
        { model: Role, as: 'role' },
        { model: Department, as: 'department' },
      ],
    });

    if (!user || !user.actif)
      return res.status(401).json({ error: 'Identifiants incorrects' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Identifiants incorrects' });

    const token = jwt.sign(
      { sub: user.id, role: user.role?.code },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '8h' }
    );

    user.last_login_at = new Date();
    await user.save();

    await logAudit(user.id, 'USER', user.id, 'LOGIN', null, null, req.ip);

    res.cookie('access_token', token, COOKIE_OPTS);
    res.json({
      user: {
        id: user.id, email: user.email,
        nom: user.nom, prenom: user.prenom,
        role: user.role?.code, role_libelle: user.role?.libelle,
        department: user.department?.libelle,
      },
      token,
    });
  } catch (e) { next(e); }
};

exports.logout = (req, res) => {
  res.clearCookie('access_token');
  res.json({ message: 'Déconnecté' });
};

exports.me = (req, res) => {
  res.json({
    user: {
      id: req.user.id, email: req.user.email,
      nom: req.user.nom, prenom: req.user.prenom,
      role: req.user.role?.code, role_libelle: req.user.role?.libelle,
      department_id: req.user.department_id,
    },
  });
};
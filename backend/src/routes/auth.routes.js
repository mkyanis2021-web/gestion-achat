const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Trop de tentatives, réessayez dans 15 minutes' },
});

router.post('/login', loginLimiter, ctrl.login);
router.post('/logout', ctrl.logout);
router.get('/me', auth, ctrl.me);

module.exports = router;
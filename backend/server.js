require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./src/models');

const app = express();

// Sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // autorise les cookies
}));

// Parsing
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));
app.use('/api/auth', require('./src/routes/auth.routes'));

// Gestion erreurs
app.use(require('./src/middlewares/error'));

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connecté');
    app.listen(PORT, () => console.log(`🚀 API : http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ DB :', err);
    process.exit(1);
  }
})();
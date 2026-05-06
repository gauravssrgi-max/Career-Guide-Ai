process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const surveyRoutes = require('./routes/survey');
const careerRoutes = require('./routes/careers');
const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/user');
const copilotRoutes = require('./routes/copilot');
const phase2Routes = require('./routes/phase2');

const app = express();

// ✅ Always use env port
const PORT = process.env.PORT || 5000;

// ─── Connect DB ─────────────────────────────
connectDB();

// ─── Middleware ─────────────────────────────
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Rate Limiting ──────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
});
app.use('/api/ai/', aiLimiter);

// ─── Routes ─────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/phase2', phase2Routes);

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API running',
    port: PORT,
  });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// ─── Start Server ───────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const cron = require('node-cron');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./config/database');
connectDB();

// Initialize achievements
const Achievement = require('./models/Achievement');
Achievement.initializeAchievements();

// Route files
const auth = require('./routes/auth');
const habits = require('./routes/habits');
const analytics = require('./routes/analytics');
const leaderboard = require('./routes/leaderboard');

// Error handler
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/habits', habits);
app.use('/api/analytics', analytics);
app.use('/api/leaderboard', leaderboard);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Scheduled tasks (cron jobs)
// Reset daily streaks at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily streak check...');
  const Habit = require('./models/Habit');
  const HabitLog = require('./models/HabitLog');
  
  const habits = await Habit.find({ isActive: true });
  
  for (const habit of habits) {
    await habit.updateStreak(false);
  }
});

// Send daily reminders (9 AM)
cron.schedule('0 9 * * *', async () => {
  console.log('Sending daily reminders...');
  // Implementation for push notifications/email reminders
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});
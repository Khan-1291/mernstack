const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  avatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=random'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // Gamification fields
  level: {
    type: Number,
    default: 1
  },
  experiencePoints: {
    type: Number,
    default: 0
  },
  progressScore: {
    type: Number,
    default: 0
  },
  totalHabitsCompleted: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  isPublicProfile: {
    type: Boolean,
    default: true
  },
  notificationSettings: {
    dailyReminder: { type: Boolean, default: true },
    streakWarning: { type: Boolean, default: true },
    achievementNotifications: { type: Boolean, default: true }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for leaderboard queries
userSchema.index({ progressScore: -1 });
userSchema.index({ level: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate level based on experience points
userSchema.methods.calculateLevel = function() {
  // Level up every 1000 XP
  const newLevel = Math.floor(this.experiencePoints / 1000) + 1;
  if (newLevel > this.level) {
    this.level = newLevel;
  }
  return this.level;
};

// Update progress score algorithm
userSchema.methods.updateProgressScore = function(habits, logs) {
  let score = 0;
  
  // Base score from habits count (max 100)
  score += Math.min(habits.length * 10, 100);
  
  // Completion rate (max 200)
  const totalPossibleCompletions = habits.length * 30; // Last 30 days
  const actualCompletions = logs.filter(log => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return log.completedAt > thirtyDaysAgo;
  }).length;
  
  const completionRate = totalPossibleCompletions > 0 
    ? (actualCompletions / totalPossibleCompletions) * 200 
    : 0;
  score += completionRate;
  
  // Streak bonus (max 150)
  const activeStreaks = habits.reduce((acc, habit) => acc + (habit.streak > 0 ? 1 : 0), 0);
  score += Math.min(activeStreaks * 15, 150);
  
  // Consistency bonus (max 100)
  const consistencyBonus = this.currentStreak * 2;
  score += Math.min(consistencyBonus, 100);
  
  // Long-term tracking bonus (max 50)
  const accountAge = Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
  score += Math.min(accountAge * 0.5, 50);
  
  this.progressScore = Math.round(score);
  return this.progressScore;
};

module.exports = mongoose.model('User', userSchema);
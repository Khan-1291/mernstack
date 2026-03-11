const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  category: {
    type: String,
    enum: ['streak', 'completion', 'social', 'milestone', 'special'],
    required: true
  },
  requirement: {
    type: {
      type: String,
      enum: ['streak_days', 'total_completions', 'habits_count', 'score_threshold', 'special'],
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  xpReward: {
    type: Number,
    default: 100
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
}, {
  timestamps: true
});

// Pre-defined achievements
achievementSchema.statics.initializeAchievements = async function() {
  const defaultAchievements = [
    {
      name: 'Getting Started',
      description: 'Complete your first habit',
      icon: '🌱',
      category: 'completion',
      requirement: { type: 'total_completions', value: 1 },
      xpReward: 50,
      rarity: 'common'
    },
    {
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      category: 'streak',
      requirement: { type: 'streak_days', value: 7 },
      xpReward: 100,
      rarity: 'common'
    },
    {
      name: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: '📅',
      category: 'streak',
      requirement: { type: 'streak_days', value: 30 },
      xpReward: 500,
      rarity: 'rare'
    },
    {
      name: 'Century Club',
      description: 'Complete 100 habits total',
      icon: '💯',
      category: 'completion',
      requirement: { type: 'total_completions', value: 100 },
      xpReward: 1000,
      rarity: 'epic'
    },
    {
      name: 'Habit Collector',
      description: 'Create 10 active habits',
      icon: '📚',
      category: 'milestone',
      requirement: { type: 'habits_count', value: 10 },
      xpReward: 300,
      rarity: 'rare'
    },
    {
      name: 'Score Champion',
      description: 'Reach a progress score of 500',
      icon: '👑',
      category: 'milestone',
      requirement: { type: 'score_threshold', value: 500 },
      xpReward: 2000,
      rarity: 'legendary'
    }
  ];
  
  for (const achievement of defaultAchievements) {
    await this.findOneAndUpdate(
      { name: achievement.name },
      achievement,
      { upsert: true, new: true }
    );
  }
  
  console.log('Achievements initialized');
};

module.exports = mongoose.model('Achievement', achievementSchema);
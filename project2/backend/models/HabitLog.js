const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema({
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  completedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  mood: {
    type: String,
    enum: ['great', 'good', 'neutral', 'tired', 'bad'],
    default: 'good'
  },
  xpEarned: {
    type: Number,
    default: 10 // Base XP for completing a habit
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate completions per day
habitLogSchema.index({ habit: 1, date: 1 }, { unique: true });

// Static method to get completion heatmap data
habitLogSchema.statics.getHeatmapData = async function(userId, habitId = null, days = 365) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const matchStage = {
    user: new mongoose.Types.ObjectId(userId),
    
    date: { $gte: startDate }
  };
  
  if (habitId) {
    matchStage.habit = mongoose.Types.ObjectId(habitId);
  }
  
  const heatmapData = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$date' }
        },
        count: { $sum: 1 },
        xp: { $sum: '$xpEarned' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  return heatmapData;
};

module.exports = mongoose.model('HabitLog', habitLogSchema);
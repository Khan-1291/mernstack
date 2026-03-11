const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Habit title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['health', 'productivity', 'learning', 'personal', 'finance', 'creativity', 'custom'],
    default: 'health'
  },
  customCategory: {
    type: String,
    trim: true,
    required: function() {
      return this.category === 'custom';
    }
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily'
  },
  frequencyConfig: {
    daysPerWeek: {
      type: Number,
      min: 1,
      max: 7,
      default: 7
    },
    specificDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  color: {
    type: String,
    default: '#4F46E5' // Default indigo color
  },
  icon: {
    type: String,
    default: 'check'
  },
  streak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  totalCompletions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  reminderTime: {
    type: String, // Format: "HH:mm"
    default: null
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient querying
habitSchema.index({ user: 1, isActive: 1 });
habitSchema.index({ category: 1 });

// Method to check if habit should be completed today
habitSchema.methods.shouldCompleteToday = function() {
  if (this.frequency === 'daily') return true;
  
  if (this.frequency === 'weekly') {
    const today = new Date().toLocaleLowerCase();
    return this.frequencyConfig.specificDays.includes(today);
  }
  
  return true;
};

// Method to update streak
habitSchema.methods.updateStreak = async function(completed) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get last completion
  const HabitLog = mongoose.model('HabitLog');
  const lastLog = await HabitLog.findOne({ habit: this._id })
    .sort({ completedAt: -1 });
  
  if (completed) {
    if (lastLog) {
      const lastDate = new Date(lastLog.completedAt);
      lastDate.setHours(0, 0, 0, 0);
      
      if (lastDate.getTime() === yesterday.getTime()) {
        // Continued streak
        this.streak += 1;
      } else if (lastDate.getTime() !== today.getTime()) {
        // New streak
        this.streak = 1;
      }
    } else {
      this.streak = 1;
    }
    
    this.totalCompletions += 1;
    if (this.streak > this.longestStreak) {
      this.longestStreak = this.streak;
    }
  } else {
    // Check if streak should be broken
    if (this.shouldCompleteToday()) {
      const lastCompletion = lastLog ? new Date(lastLog.completedAt) : null;
      if (lastCompletion) {
        const daysSinceLastCompletion = Math.floor((today - lastCompletion) / (1000 * 60 * 60 * 24));
        if (daysSinceLastCompletion > 1) {
          this.streak = 0;
        }
      }
    }
  }
  
  return this.save();
};

module.exports = mongoose.model('Habit', habitSchema);
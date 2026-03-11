const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const User = require('../models/User');
const Achievement = require('../models/Achievement');

// @desc    Get all habits for user
// @route   GET /api/habits
// @access  Private
exports.getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user.id, isActive: true })
      .sort({ createdAt: -1 });

    // Get today's completion status for each habit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const habitsWithStatus = await Promise.all(habits.map(async (habit) => {
      const todayLog = await HabitLog.findOne({
        habit: habit._id,
        date: { $gte: today, $lt: tomorrow }
      });
      
      return {
        ...habit.toObject(),
        completedToday: !!todayLog
      };
    }));

    res.json({
      success: true,
      count: habits.length,
      data: habitsWithStatus
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
exports.createHabit = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    
    const habit = await Habit.create(req.body);
    
    // Update user's progress score
    const user = await User.findById(req.user.id);
    const habits = await Habit.find({ user: req.user.id });
    const logs = await HabitLog.find({ user: req.user.id });
    await user.updateProgressScore(habits, logs);
    await user.save();

    res.status(201).json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
exports.updateHabit = async (req, res, next) => {
  try {
    let habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete habit (soft delete)
// @route   DELETE /api/habits/:id
// @access  Private
exports.deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    habit.isActive = false;
    await habit.save();

    res.json({
      success: true,
      message: 'Habit deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete habit for today
// @route   POST /api/habits/:id/complete
// @access  Private
exports.completeHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    // Check if already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingLog = await HabitLog.findOne({
      habit: habit._id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existingLog) {
      return res.status(400).json({
        success: false,
        message: 'Habit already completed today'
      });
    }

    // Create completion log
    const log = await HabitLog.create({
      habit: habit._id,
      user: req.user.id,
      date: today,
      completedAt: new Date(),
      notes: req.body.notes || '',
      mood: req.body.mood || 'good',
      xpEarned: 10 + Math.floor(habit.streak / 7) // Bonus XP for longer streaks
    });

    // Update habit streak
    await habit.updateStreak(true);

    // Update user stats
    const user = await User.findById(req.user.id);
    user.experiencePoints += log.xpEarned;
    user.totalHabitsCompleted += 1;
    user.calculateLevel();

    // Update progress score
    const habits = await Habit.find({ user: req.user.id });
    const logs = await HabitLog.find({ user: req.user.id });
    await user.updateProgressScore(habits, logs);

    // Check for achievements
    const newAchievements = await checkAchievements(user, habit);
    user.achievements.push(...newAchievements.map(a => a._id));

    await user.save();

    res.json({
      success: true,
      data: {
        log,
        habit,
        xpEarned: log.xpEarned,
        newAchievements,
        userLevel: user.level,
        totalXP: user.experiencePoints
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get habit statistics
// @route   GET /api/habits/:id/stats
// @access  Private
exports.getHabitStats = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    // Get completion logs for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await HabitLog.find({
      habit: habit._id,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });

    // Calculate statistics
    const completionRate = (logs.length / 30) * 100;
    const weeklyData = [];
    
    // Group by week
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const weekLogs = logs.filter(log => 
        log.date >= weekStart && log.date < weekEnd
      );
      
      weeklyData.unshift({
        week: 4 - i,
        completions: weekLogs.length
      });
    }

    res.json({
      success: true,
      data: {
        habit,
        completionRate: Math.round(completionRate),
        totalCompletions: habit.totalCompletions,
        currentStreak: habit.streak,
        longestStreak: habit.longestStreak,
        weeklyData,
        recentLogs: logs.slice(-7)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to check achievements
async function checkAchievements(user, habit) {
  const newAchievements = [];
  const allAchievements = await Achievement.find();
  
  for (const achievement of allAchievements) {
    // Skip if already earned
    if (user.achievements.includes(achievement._id)) continue;
    
    let earned = false;
    
    switch (achievement.requirement.type) {
      case 'streak_days':
        if (habit.streak >= achievement.requirement.value) earned = true;
        break;
      case 'total_completions':
        if (user.totalHabitsCompleted >= achievement.requirement.value) earned = true;
        break;
      case 'habits_count':
        const activeHabits = await Habit.countDocuments({ user: user._id, isActive: true });
        if (activeHabits >= achievement.requirement.value) earned = true;
        break;
      case 'score_threshold':
        if (user.progressScore >= achievement.requirement.value) earned = true;
        break;
    }
    
    if (earned) {
      newAchievements.push(achievement);
      user.experiencePoints += achievement.xpReward;
    }
  }
  
  return newAchievements;
}
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const User = require('../models/User');

// @desc    Get user dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get all habits
    const habits = await Habit.find({ user: userId, isActive: true });
    
    // Get logs for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentLogs = await HabitLog.find({
      user: userId,
      date: { $gte: thirtyDaysAgo }
    }).populate('habit', 'title category color');

    // Calculate overall statistics
    const totalHabits = habits.length;
    const completedToday = await getCompletedTodayCount(userId, habits);
    const weeklyCompletion = calculateWeeklyCompletion(recentLogs, habits);
    const categoryBreakdown = getCategoryBreakdown(habits, recentLogs);
    const heatmapData = await HabitLog.getHeatmapData(userId, null, 365);
    
    // Streak statistics
    const activeStreaks = habits.filter(h => h.streak > 0).length;
    const longestHabitStreak = Math.max(...habits.map(h => h.streak), 0);
    
    // Consistency score (0-100)
    const consistencyScore = calculateConsistencyScore(recentLogs, habits);
    
    // Weekly report
    const weeklyReport = generateWeeklyReport(recentLogs, habits);

    res.json({
      success: true,
      data: {
        overview: {
          totalHabits,
          activeStreaks,
          longestHabitStreak,
          completedToday,
          consistencyScore
        },
        weeklyCompletion,
        categoryBreakdown,
        heatmapData,
        weeklyReport,
        recentActivity: recentLogs.slice(-10).reverse()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get habit heatmap data
// @route   GET /api/analytics/heatmap
// @access  Private
exports.getHeatmap = async (req, res, next) => {
  try {
    const { habitId, days = 365 } = req.query;
    const heatmapData = await HabitLog.getHeatmapData(
      req.user.id, 
      habitId || null, 
      parseInt(days)
    );
    
    res.json({
      success: true,
      data: heatmapData
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
async function getCompletedTodayCount(userId, habits) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayLogs = await HabitLog.countDocuments({
    user: userId,
    date: { $gte: today, $lt: tomorrow }
  });
  
  return {
    completed: todayLogs,
    total: habits.length,
    percentage: habits.length > 0 ? Math.round((todayLogs / habits.length) * 100) : 0
  };
}

function calculateWeeklyCompletion(logs, habits) {
  const weeks = [];
  const now = new Date();
  
  for (let i = 0; i < 12; i++) {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - (i * 7));
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 7);
    
    const weekLogs = logs.filter(log => 
      log.date >= weekStart && log.date < weekEnd
    );
    
    const possibleCompletions = habits.length * 7;
    const actualCompletions = weekLogs.length;
    
    weeks.unshift({
      week: `Week ${12 - i}`,
      completionRate: possibleCompletions > 0 
        ? Math.round((actualCompletions / possibleCompletions) * 100) 
        : 0,
      completions: actualCompletions
    });
  }
  
  return weeks;
}

function getCategoryBreakdown(habits, logs) {
  const categories = {};
  
  habits.forEach(habit => {
    const category = habit.category === 'custom' ? habit.customCategory : habit.category;
    if (!categories[category]) {
      categories[category] = { total: 0, completed: 0, color: habit.color };
    }
    categories[category].total += 1;
  });
  
  logs.forEach(log => {
    if (log.habit) {
      const category = log.habit.category === 'custom' 
        ? log.habit.customCategory 
        : log.habit.category;
      if (categories[category]) {
        categories[category].completed += 1;
      }
    }
  });
  
  return Object.entries(categories).map(([name, data]) => ({
    name,
    ...data,
    percentage: data.total > 0 ? Math.round((data.completed / (data.total * 30)) * 100) : 0
  }));
}

function calculateConsistencyScore(logs, habits) {
  if (habits.length === 0) return 0;
  
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  
  const dailyCompletions = {};
  logs.forEach(log => {
    const dateKey = log.date.toISOString().split('T')[0];
    dailyCompletions[dateKey] = (dailyCompletions[dateKey] || 0) + 1;
  });
  
  let consistencyPoints = 0;
  const daysWithData = Object.keys(dailyCompletions).length;
  
  // Points for daily activity
  consistencyPoints += (daysWithData / 30) * 50;
  
  // Points for habit diversity
  const uniqueHabitsCompleted = new Set(logs.map(l => l.habit?._id?.toString())).size;
  consistencyPoints += (uniqueHabitsCompleted / habits.length) * 50;
  
  return Math.min(Math.round(consistencyPoints), 100);
}

function generateWeeklyReport(logs, habits) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);
  
  const weekLogs = logs.filter(log => log.date >= weekStart);
  
  const bestDay = weekLogs.reduce((acc, log) => {
    const day = log.date.toLocaleDateString('en-US', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  
  const topDay = Object.entries(bestDay).sort((a, b) => b[1] - a[1])[0];
  
  return {
    totalCompletions: weekLogs.length,
    uniqueHabitsCompleted: new Set(weekLogs.map(l => l.habit?._id?.toString())).size,
    averagePerDay: (weekLogs.length / 7).toFixed(1),
    bestDay: topDay ? topDay[0] : 'None',
    improvement: calculateImprovement(logs)
  };
}

function calculateImprovement(logs) {
  if (logs.length < 14) return 0;
  
  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(thisWeekStart.getDate() - 7);
  
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  
  const thisWeekCount = logs.filter(l => l.date >= thisWeekStart).length;
  const lastWeekCount = logs.filter(l => l.date >= lastWeekStart && l.date < thisWeekStart).length;
  
  if (lastWeekCount === 0) return 100;
  return Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
}
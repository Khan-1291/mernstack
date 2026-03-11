const User = require('../models/User');

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Public/Private
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { period = 'all', limit = 50 } = req.query;
    
    let sortField = 'progressScore';
    let timeFilter = {};
    
    // Time-based filtering could be enhanced with date range queries
    if (period === 'weekly') {
      // For weekly, we could sort by weekly XP gain (requires additional field)
      sortField = 'progressScore';
    } else if (period === 'monthly') {
      sortField = 'progressScore';
    }

    const leaderboard = await User.find({ isPublicProfile: true })
      .select('username avatar level progressScore totalHabitsCompleted longestStreak')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit))
      .lean();

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
      isCurrentUser: req.user && user._id.toString() === req.user.id
    }));

    // Get current user's rank if not in top list
    let currentUserRank = null;
    if (req.user) {
      const userInList = rankedLeaderboard.find(u => u.isCurrentUser);
      if (!userInList) {
        const userCount = await User.countDocuments({
          isPublicProfile: true,
          [sortField]: { $gt: req.user.progressScore }
        });
        currentUserRank = {
          rank: userCount + 1,
          ...req.user,
          isCurrentUser: true
        };
      }
    }

    res.json({
      success: true,
      period,
      data: rankedLeaderboard,
      currentUserRank,
      totalParticipants: await User.countDocuments({ isPublicProfile: true })
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top performers with motivational quotes
// @route   GET /api/leaderboard/top
// @access  Public
exports.getTopPerformers = async (req, res, next) => {
  try {
    const topUsers = await User.find({ isPublicProfile: true })
      .select('username avatar level progressScore achievements')
      .populate('achievements', 'name icon')
      .sort({ progressScore: -1 })
      .limit(3)
      .lean();

    const motivationalQuotes = [
      "Consistency is the key to success! 🔑",
      "Small steps lead to big changes! 🚀",
      "Your dedication inspires others! ⭐",
      "Excellence is a habit, not an act! 🏆",
      "You're building a better future! 🌟"
    ];

    const topPerformers = topUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
      quote: motivationalQuotes[index] || motivationalQuotes[0],
      badge: index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'
    }));

    res.json({
      success: true,
      data: topPerformers
    });
  } catch (error) {
    next(error);
  }
};
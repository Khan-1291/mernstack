const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const {
  getLeaderboard,
  getTopPerformers
} = require('../controllers/leaderboardController');

router.get('/', optionalAuth, getLeaderboard);
router.get('/top', getTopPerformers);

module.exports = router;
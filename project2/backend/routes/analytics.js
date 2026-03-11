const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboard,
  getHeatmap
} = require('../controllers/analyticsController');

router.get('/dashboard', protect, getDashboard);
router.get('/heatmap', protect, getHeatmap);

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateHabit } = require('../middleware/validation');
const {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  getHabitStats
} = require('../controllers/habitController');

router.get('/', protect, getHabits);
router.post('/', protect, validateHabit, createHabit);
router.put('/:id', protect, validateHabit, updateHabit);
router.delete('/:id', protect, deleteHabit);
router.post('/:id/complete', protect, completeHabit);
router.get('/:id/stats', protect, getHabitStats);

module.exports = router;
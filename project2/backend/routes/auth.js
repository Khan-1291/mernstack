const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');
const {
  register,
  login,
  getMe,
  updateProfile,
  verifyEmail
} = require('../controllers/authController');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/verify-email/:token', verifyEmail);

module.exports = router;
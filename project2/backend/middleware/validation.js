const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
exports.validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  this.handleValidationErrors
];

exports.validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required'),
  this.handleValidationErrors
];

// Habit validation rules
exports.validateHabit = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('category')
    .isIn(['health', 'productivity', 'learning', 'personal', 'finance', 'creativity', 'custom'])
    .withMessage('Invalid category'),
  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'custom'])
    .withMessage('Invalid frequency'),
  this.handleValidationErrors
];
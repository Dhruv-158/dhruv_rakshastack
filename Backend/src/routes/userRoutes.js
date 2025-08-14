const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controller/userController');
const { handleValidationErrors, requestLogger, rateLimitInfo } = require('../middleware/validation');
const { uploadProfileImage, handleUploadError } = require('../middleware/upload');

const router = express.Router();
const userController = new UserController();

// Apply middleware to all routes
router.use(requestLogger);
router.use(rateLimitInfo);

// Validation middleware for registration
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Validation middleware for login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

router.post('/register', validateRegistration, handleValidationErrors, userController.register);
router.post('/login', validateLogin, handleValidationErrors, userController.login);
router.get('/profile/:id', userController.getProfile);
router.get('/', userController.getAllUsers);
router.put('/profile/:id', userController.updateProfile);

// 📸 User Profile with Image Upload
router.put('/profile/:id/with-image', 
  (req, res, next) => {
    uploadProfileImage(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  },
  userController.updateProfileWithImage
);

module.exports = router;

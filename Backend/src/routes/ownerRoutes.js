const express = require('express');
const OwnerController = require('../controller/ownerController');
const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const { uploadProfileImage, handleUploadError } = require('../middleware/upload');

const router = express.Router();
const ownerController = new OwnerController();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => error.msg)
    });
  }
  next();
};

// Owner registration validation
const ownerRegistrationValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2-100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Owner login validation
const ownerLoginValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Owner update validation
const ownerUpdateValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2-100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('phone')
    .optional()
    .isMobilePhone('en-IN')
    .withMessage('Valid phone number is required'),

  body('business_name')
    .optional()
    .isLength({ min: 2, max: 150 })
    .withMessage('Business name must be between 2-150 characters'),

  body('business_address')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Business address must not exceed 1000 characters'),

  body('verification_status')
    .optional()
    .isIn(['pending', 'verified', 'rejected'])
    .withMessage('Verification status must be one of: pending, verified, rejected'),

  body('documents')
    .optional()
    .isArray()
    .withMessage('Documents must be an array'),

  body('profile_image')
    .optional()
    .isString()
    .withMessage('Profile image must be a valid string'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be a boolean')
];


router.post('/register', 
  ownerRegistrationValidation,
  handleValidationErrors,
  ownerController.register
);

router.post('/login',
  ownerLoginValidation,
  handleValidationErrors,
  ownerController.login
);

router.get('/:id', ownerController.getProfile);

router.get('/', ownerController.getAllOwners);

router.put('/:id',
  ownerUpdateValidation,
  handleValidationErrors,
  ownerController.updateProfile
);

// 📸 Owner Profile with Image Upload
router.put('/:id/with-image',
  (req, res, next) => {
    uploadProfileImage(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  },
  ownerController.updateProfileWithImage
);

// 🏠 OWNER DASHBOARD ROUTES 🏠
router.get('/:id/dashboard', ownerController.getDashboard);

router.get('/:id/pg-listings', ownerController.getMyPGListings);

router.put('/:id/pg-listings/:pgId/status', ownerController.updatePGStatus);

router.get('/:id/metrics', ownerController.getBusinessMetrics);

// Health check route for owners API
router.get('/health/check', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Owner API is working',
    timestamp: new Date().toISOString(),
    service: 'Owner Authentication Service'
  });
});

module.exports = router;

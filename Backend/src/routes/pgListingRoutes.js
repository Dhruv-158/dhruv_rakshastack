const express = require('express');
const { body, query } = require('express-validator');
const PGListingController = require('../controller/pgListingController');
const { handleValidationErrors, requestLogger, rateLimitInfo } = require('../middleware/validation');
const AuthMiddleware = require('../middleware/auth');
const { uploadPGImages, uploadMultipleImages, handleUploadError } = require('../middleware/upload');

const router = express.Router();
const pgListingController = new PGListingController();

// Apply middleware to all routes
router.use(requestLogger);
router.use(rateLimitInfo);

// Validation middleware for adding PG listing
const validateAddPGListing = [
  body('owner_id')
    .isUUID()
    .withMessage('Valid owner ID is required'),
  
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('PG name must be between 3 and 200 characters'),
  
  body('location')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Location must be between 5 and 500 characters'),
  
  body('city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a valid number')
    .custom(value => {
      if (parseFloat(value) <= 0) {
        throw new Error('Price must be greater than 0');
      }
      return true;
    }),
  
  body('gender')
    .isIn(['male', 'female', 'both'])
    .withMessage('Gender must be one of: male, female, both'),
  
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  
  body('room_type')
    .optional()
    .isIn(['single', 'double', 'triple', 'dormitory'])
    .withMessage('Room type must be one of: single, double, triple, dormitory'),
  
  body('available_rooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available rooms must be a non-negative integer'),
  
  body('total_rooms')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total rooms must be at least 1'),
  
  body('contact_phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('contact_email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
];

// Validation middleware for query parameters
const validatePGListingQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('minPrice')
    .optional()
    .isNumeric()
    .withMessage('Minimum price must be a valid number'),
  
  query('maxPrice')
    .optional()
    .isNumeric()
    .withMessage('Maximum price must be a valid number'),
  
  query('gender')
    .optional()
    .isIn(['male', 'female', 'both'])
    .withMessage('Gender must be one of: male, female, both'),
  
  query('roomType')
    .optional()
    .isIn(['single', 'double', 'triple', 'dormitory'])
    .withMessage('Room type must be one of: single, double, triple, dormitory'),
  
  query('sortBy')
    .optional()
    .isIn(['created_at', 'price', 'name'])
    .withMessage('Sort by must be one of: created_at, price, name'),
  
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Sort order must be ASC or DESC')
];

router.post('/add-pg', AuthMiddleware.authenticateToken, validateAddPGListing, handleValidationErrors, pgListingController.addPGListing);

// 📸 Add PG with Images (NEW INTEGRATED APPROACH)
router.post('/add-with-images', 
  AuthMiddleware.authenticateToken,
  uploadMultipleImages.fields([{ name: 'images', maxCount: 10 }]),
  pgListingController.addPGListingWithImages.bind(pgListingController)
);

// 📸 Add PG with Images (OLD APPROACH - keeping for compatibility)
router.post('/add-pg-with-images', 
  AuthMiddleware.authenticateToken,
  (req, res, next) => {
    uploadPGImages(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  },
  pgListingController.addPGListingWithImages
);

router.get('/pg-listings', validatePGListingQuery, handleValidationErrors, pgListingController.getAllPGListings);
router.get('/pg-details/:id', pgListingController.getPGListingById);
router.get('/:name', pgListingController.getPGListingByName);

module.exports = router;

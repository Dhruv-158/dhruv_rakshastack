const express = require('express');
const ImageController = require('../controller/imageController');
const { uploadProfileImage, uploadPGImages, uploadMixed, handleUploadError } = require('../middleware/upload');
const AuthMiddleware = require('../middleware/auth');

const router = express.Router();
const imageController = new ImageController();

// 📸 IMAGE UPLOAD ROUTES 📸

// Upload single profile image
router.post('/profile', 
  AuthMiddleware.authenticateToken,
  (req, res, next) => {
    uploadProfileImage(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  },
  imageController.uploadProfileImage
);

// Upload multiple PG images
router.post('/pg-images',
  AuthMiddleware.authenticateToken,
  (req, res, next) => {
    uploadPGImages(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  },
  imageController.uploadPGImages
);

// Upload mixed images (profile + PG images)
router.post('/mixed',
  AuthMiddleware.authenticateToken,
  (req, res, next) => {
    uploadMixed(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  },
  imageController.uploadMixedImages
);

// Get image info
router.get('/info/:filename', imageController.getImageInfo);

// Health check for upload service
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Image upload service is working',
    maxFileSize: '5MB',
    allowedTypes: ['JPEG', 'JPG', 'PNG', 'GIF', 'WebP'],
    maxFiles: 10
  });
});

module.exports = router;

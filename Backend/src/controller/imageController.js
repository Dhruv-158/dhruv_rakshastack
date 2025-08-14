const { getFileUrl, cleanupFiles } = require('../middleware/upload');
const path = require('path');

class ImageController {
  // Upload single profile image
  uploadProfileImage = (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided',
          error: 'NO_FILE_UPLOADED'
        });
      }

      const imageUrl = getFileUrl(req, path.join('profiles', req.file.filename));

      return res.status(200).json({
        success: true,
        message: 'Profile image uploaded successfully',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          url: imageUrl,
          path: req.file.path
        }
      });

    } catch (error) {
      // Cleanup uploaded file if error occurs
      if (req.file) {
        cleanupFiles(req.file);
      }

      console.error('❌ Profile image upload error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload profile image',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Upload multiple PG images
  uploadPGImages = (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No image files provided',
          error: 'NO_FILES_UPLOADED'
        });
      }

      const uploadedImages = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: getFileUrl(req, path.join('pg-listings', file.filename)),
        path: file.path
      }));

      return res.status(200).json({
        success: true,
        message: `${req.files.length} PG images uploaded successfully`,
        data: {
          images: uploadedImages,
          totalFiles: req.files.length,
          totalSize: req.files.reduce((sum, file) => sum + file.size, 0)
        }
      });

    } catch (error) {
      // Cleanup uploaded files if error occurs
      if (req.files) {
        cleanupFiles(req.files);
      }

      console.error('❌ PG images upload error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload PG images',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Upload mixed images (profile + PG images)
  uploadMixedImages = (req, res) => {
    try {
      const result = {
        profileImage: null,
        pgImages: []
      };

      // Handle profile image
      if (req.files.profile_image && req.files.profile_image[0]) {
        const file = req.files.profile_image[0];
        result.profileImage = {
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          url: getFileUrl(req, path.join('profiles', file.filename)),
          path: file.path
        };
      }

      // Handle PG images
      if (req.files.pg_images && req.files.pg_images.length > 0) {
        result.pgImages = req.files.pg_images.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          url: getFileUrl(req, path.join('pg-listings', file.filename)),
          path: file.path
        }));
      }

      if (!result.profileImage && result.pgImages.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid image files provided',
          error: 'NO_VALID_FILES'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: result
      });

    } catch (error) {
      // Cleanup uploaded files if error occurs
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          cleanupFiles(file);
        });
      }

      console.error('❌ Mixed images upload error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload images',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Get image info
  getImageInfo = (req, res) => {
    try {
      const { filename } = req.params;
      
      if (!filename) {
        return res.status(400).json({
          success: false,
          message: 'Filename is required'
        });
      }

      // You can add logic to get image metadata from database here
      const imageUrl = getFileUrl(req, filename);

      return res.status(200).json({
        success: true,
        data: {
          filename,
          url: imageUrl
        }
      });

    } catch (error) {
      console.error('❌ Get image info error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to get image info',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };
}

module.exports = ImageController;

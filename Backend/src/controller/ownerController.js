const OwnerService = require('../services/ownerService');
const { getFileUrl, cleanupFiles } = require('../middleware/upload');
const path = require('path');

class OwnerController {
  constructor() {
    this.ownerService = new OwnerService();
  }

  // Register new owner
  register = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required',
          errors: ['Missing required fields']
        });
      }

      // Validate input data
      const validationErrors = this.ownerService.validateOwnerRegistrationData({
        name, email, password
      });

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      // Register owner through service
      const result = await this.ownerService.registerOwner({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password
      });

      // Success response
      return res.status(201).json({
        success: true,
        message: result.message,
        data: {
          owner: result.owner
        }
      });

    } catch (error) {
      console.error('❌ Owner registration error:', error.message);

      // Handle specific errors
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          message: 'Owner already exists',
          error: error.message
        });
      }

      // Generic error response
      return res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Login owner
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
          errors: ['Missing required fields']
        });
      }

      // Validate input data
      const validationErrors = this.ownerService.validateOwnerLoginData({
        email, password
      });

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      // Login owner through service
      const result = await this.ownerService.loginOwner({
        email: email.toLowerCase().trim(),
        password
      });

      // Success response
      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          owner: result.owner,
          token: result.token,
          expiresIn: result.expiresIn
        }
      });

    } catch (error) {
      console.error('❌ Owner login error:', error.message);

      // Handle specific errors
      if (error.message.includes('Invalid email or password')) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          error: 'Email or password is incorrect'
        });
      }

      if (error.message.includes('deactivated')) {
        return res.status(403).json({
          success: false,
          message: 'Account deactivated',
          error: error.message
        });
      }

      // Generic error response
      return res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Get owner profile
  getProfile = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required'
        });
      }

      const owner = await this.ownerService.getOwnerById(id);

      return res.status(200).json({
        success: true,
        message: 'Owner profile retrieved successfully',
        data: { owner }
      });

    } catch (error) {
      console.error('❌ Get owner profile error:', error.message);

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Owner not found',
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve owner profile',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Get all owners (admin function)
  getAllOwners = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const result = await this.ownerService.getAllOwners(limit, offset);

      return res.status(200).json({
        success: true,
        message: 'Owners retrieved successfully',
        data: result
      });

    } catch (error) {
      console.error('❌ Get all owners error:', error.message);

      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve owners',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Update owner profile
  updateProfile = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required'
        });
      }

      // Remove sensitive fields from update
      const { password, email, ...safeUpdateData } = updateData;

      const updatedOwner = await this.ownerService.updateOwner(id, safeUpdateData);

      return res.status(200).json({
        success: true,
        message: 'Owner profile updated successfully',
        data: { owner: updatedOwner }
      });

    } catch (error) {
      console.error('❌ Update owner profile error:', error.message);

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Owner not found',
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to update owner profile',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Update owner profile with image upload
  updateProfileWithImage = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required'
        });
      }

      // Handle uploaded image
      let profileImageUrl = null;
      if (req.file) {
        profileImageUrl = getFileUrl(req, path.join('profiles', req.file.filename));
        updateData.profile_image = profileImageUrl;
      }

      // Remove sensitive fields from update
      const { password, email, ...safeUpdateData } = updateData;

      const updatedOwner = await this.ownerService.updateOwner(id, safeUpdateData);

      return res.status(200).json({
        success: true,
        message: 'Owner profile updated successfully with image',
        data: { 
          owner: updatedOwner,
          uploadedImage: req.file ? {
            filename: req.file.filename,
            url: profileImageUrl,
            size: req.file.size
          } : null
        }
      });

    } catch (error) {
      // Cleanup uploaded file if error occurs
      if (req.file) {
        cleanupFiles(req.file);
      }

      console.error('❌ Update owner profile with image error:', error.message);

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Owner not found',
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to update owner profile with image',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // 🏠 OWNER DASHBOARD APIS 🏠

  // Get owner dashboard with analytics
  getDashboard = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required'
        });
      }

      const dashboardData = await this.ownerService.getOwnerDashboard(id);

      return res.status(200).json({
        success: true,
        message: 'Owner dashboard data retrieved successfully',
        data: dashboardData
      });

    } catch (error) {
      console.error('❌ Get owner dashboard error:', error.message);

      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve dashboard data',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Get owner's PG listings with filters
  getMyPGListings = async (req, res) => {
    try {
      const { id } = req.params;
      const filters = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required'
        });
      }

      const result = await this.ownerService.getOwnerPGListings(id, filters);

      return res.status(200).json({
        success: true,
        message: 'Owner PG listings retrieved successfully',
        data: result
      });

    } catch (error) {
      console.error('❌ Get owner PG listings error:', error.message);

      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve PG listings',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Update PG listing status
  updatePGStatus = async (req, res) => {
    try {
      const { id, pgId } = req.params;
      const { is_active } = req.body;

      if (!id || !pgId) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID and PG ID are required'
        });
      }

      if (typeof is_active !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'is_active must be a boolean value'
        });
      }

      const result = await this.ownerService.updatePGListingStatus(id, pgId, is_active);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.pgListing
      });

    } catch (error) {
      console.error('❌ Update PG status error:', error.message);

      if (error.message.includes('not found') || error.message.includes('permission')) {
        return res.status(404).json({
          success: false,
          message: 'PG listing not found or access denied',
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to update PG status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Get business metrics
  getBusinessMetrics = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required'
        });
      }

      const metrics = await this.ownerService.getBusinessMetrics(id);

      return res.status(200).json({
        success: true,
        message: 'Business metrics retrieved successfully',
        data: metrics
      });

    } catch (error) {
      console.error('❌ Get business metrics error:', error.message);

      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve business metrics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };
}

module.exports = OwnerController;

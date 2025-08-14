const UserService = require('../services/userService');
const { getFileUrl, cleanupFiles } = require('../middleware/upload');
const path = require('path');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  // Login user
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
      const validationErrors = this.userService.validateLoginData({
        email, password
      });

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }
      // Login user through service
      const result = await this.userService.loginUser({
        email: email.toLowerCase().trim(),
        password
      });
      // Success response
      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          token: result.token,
          expiresIn: result.expiresIn
        }
      });

    } catch (error) {
      console.error('❌ Login error:', error.message);

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

  // Register new user
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
      const validationErrors = this.userService.validateRegistrationData({
        name, email, password
      });

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      // Register user through service
      const result = await this.userService.registerUser({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password
      });

      // Success response
      return res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: result.user
        }
      });

    } catch (error) {
      console.error('❌ Registration error:', error.message);

      // Handle specific errors
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          message: 'User already exists',
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

  // Get user profile
  getProfile = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const user = await this.userService.findUserById(id);

      return res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: { user }
      });

    } catch (error) {
      console.error('❌ Get profile error:', error.message);

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user profile',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Get all users (admin function)
  getAllUsers = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const result = await this.userService.getAllUsers(limit, offset);

      return res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('❌ Get all users error:', error.message);

      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Update user profile
  updateProfile = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      // Remove sensitive fields from update
      const { password, email, ...safeUpdateData } = updateData;
      const updatedUser = await this.userService.updateUser(id, safeUpdateData);
      return res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      console.error('❌ Update profile error:', error.message);
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          error: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to update user profile',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Update user profile with image upload
  updateProfileWithImage = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
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
      
      const updatedUser = await this.userService.updateUser(id, safeUpdateData);

      return res.status(200).json({
        success: true,
        message: 'User profile updated successfully with image',
        data: { 
          user: updatedUser,
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

      console.error('❌ Update profile with image error:', error.message);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to update user profile with image',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

}

module.exports = UserController;

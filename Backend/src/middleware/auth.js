const UserService = require('../services/userService');

class AuthMiddleware {
  constructor() {
    this.userService = new UserService();
  }

  // JWT Authentication middleware
  authenticateToken = (req, res, next) => {
    try {
      // Get token from header
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.',
          error: 'Authentication required'
        });
      }

      // Verify token
      const decoded = this.userService.verifyToken(token);
      
      // Add user info to request
      req.user = decoded;
      next();

    } catch (error) {
      console.error('❌ Auth middleware error:', error.message);

      if (error.message.includes('expired')) {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
          error: 'Please login again'
        });
      }

      return res.status(403).json({
        success: false,
        message: 'Invalid token',
        error: 'Authentication failed'
      });
    }
  };

  // Optional authentication (token not required)
  optionalAuth = (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (token) {
        const decoded = this.userService.verifyToken(token);
        req.user = decoded;
      }
      
      next();
    } catch (error) {
      // Continue without authentication if token is invalid
      next();
    }
  };

  // Check if user is admin (for future use)
  requireAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    // Add admin check logic here when user roles are implemented
    // For now, all authenticated users can access admin routes
    next();
  };
}

module.exports = new AuthMiddleware();

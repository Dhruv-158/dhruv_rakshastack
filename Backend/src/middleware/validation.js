const { validationResult } = require('express-validator');

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  console.log(`📝 ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    // Log body but hide sensitive data
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = '[HIDDEN]';
    console.log('📄 Request body');
  }
  next();
};

// Rate limiting simulation (for future implementation)
const rateLimitInfo = (req, res, next) => {
  res.setHeader('X-RateLimit-Limit', '100');
  res.setHeader('X-RateLimit-Remaining', '99');
  res.setHeader('X-RateLimit-Reset', Date.now() + 60000);
  next();
};

module.exports = {
  handleValidationErrors,
  requestLogger,
  rateLimitInfo
};

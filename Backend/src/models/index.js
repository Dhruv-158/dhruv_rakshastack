// Export all models for easy importing
const User = require('./User');
const Owner = require('./Owner');
const PGListing = require('./PGListing');

module.exports = {
    User,
    Owner,
    PGListing,
};

// Model relationships documentation:
// User (1) ←→ (1) Owner
// Owner (1) ←→ (Many) PGListing

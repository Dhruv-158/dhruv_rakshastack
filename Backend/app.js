const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('reflect-metadata'); // Required for TypeORM
require('dotenv').config();

// Import database connection
const { connectDB } = require('./src/config/database');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined')); // Request logging
app.use(express.json({ limit: '10mb' })); // Body parser
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PG Management Backend is running! 🏠',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Documentation route
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PG Management API Documentation',
    version: '1.0.0',
    endpoints: {
      users: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login',
        profile: 'GET /api/users/profile/:id',
        updateProfile: 'PUT /api/users/profile/:id',
        updateProfileWithImage: 'PUT /api/users/profile/:id/with-image (Auth Required + Image)'
      },
      owners: {
        register: 'POST /api/owners/register',
        login: 'POST /api/owners/login',
        profile: 'GET /api/owners/:id',
        updateProfile: 'PUT /api/owners/:id',
        updateProfileWithImage: 'PUT /api/owners/:id/with-image (Auth Required + Image)',
        dashboard: 'GET /api/owners/:id/dashboard',
        myPGListings: 'GET /api/owners/:id/pg-listings',
        updatePGStatus: 'PUT /api/owners/:id/pg-listings/:pgId/status',
        businessMetrics: 'GET /api/owners/:id/metrics'
      },
      pgListings: {
        addPG: 'POST /api/pgs/add-pg (Auth Required)',
        addPGWithImages: 'POST /api/pgs/add-with-images (Auth Required + Images)',
        getAllPGs: 'GET /api/pgs/pg-listings',
        pgDetails: 'GET /api/pgs/pg-details/:id',
        pgByName: 'GET /api/pgs/:name'
      },
      legacyImageAPI: {
        note: '⚠️ LEGACY - Use integrated endpoints above instead',
        profileImage: 'POST /api/images/profile (Auth Required)',
        pgImages: 'POST /api/images/pg-images (Auth Required)',
        mixedUpload: 'POST /api/images/mixed (Auth Required)',
        imageInfo: 'GET /api/images/info/:filename',
        staticAccess: 'GET /uploads/:path/:filename'
      }
    },
    filters: {
      location: 'city=Ahmedabad',
      price: 'minPrice=3000&maxPrice=8000',
      gender: 'gender=male|female|both',
      roomType: 'roomType=single|double|triple|dormitory',
      search: 'search=keywords',
      pagination: 'page=1&limit=10'
    },
    dashboardFeatures: {
      analytics: 'Total listings, rooms, occupancy rates, pricing insights',
      locationMetrics: 'Performance by city with occupancy data',
      revenueTracking: 'Monthly revenue potential calculation',
      statusManagement: 'Activate/deactivate PG listings',
      businessInsights: 'Gender distribution, recent additions'
    },
    uploadSpecs: {
      integratedApproach: 'Profile + Image updates in single API call',
      maxFileSize: '5MB per file',
      allowedTypes: ['JPEG', 'JPG', 'PNG', 'GIF', 'WebP'],
      maxFiles: '10 files per upload for PG listings, 1 for profiles',
      profileUpdates: 'Use /with-image endpoints for profile + image updates',
      pgCreation: 'Use /add-with-images for PG creation with images',
      legacySupport: 'Separate image APIs still available but discouraged'
    }
  });
});

// Routes
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/pgs', require('./src/routes/pgListingRoutes'));
app.use('/api/owners', require('./src/routes/ownerRoutes'));
app.use('/api/images', require('./src/routes/imageRoutes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database with TypeORM
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`📸 Image Upload Service: http://localhost:${PORT}/api/images/health`);
      console.log(`🖼️ Static Images: http://localhost:${PORT}/uploads/`);
      console.log(`🏠 PG Management System with TypeORM Ready!`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
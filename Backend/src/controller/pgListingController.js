const PGListingService = require('../services/pgListingService');
const path = require('path');
const { getFileUrl, cleanupFiles } = require('../utils');
const OwnerService = require('../services/ownerService');
const { getFileUrl, cleanupFiles } = require('../middleware/upload');
const path = require('path');

class PGListingController {
  constructor() {
    this.pgListingService = new PGListingService();
    this.ownerService = new OwnerService();
  }

  // Add new PG listing
  addPGListing = async (req, res) => {
    try {
      const {
        name, location, price, amenities, gender, images,
        city, address, room_type, available_rooms, total_rooms,
        description, contact_phone, contact_email, wifi, parking,
        laundry, food_included, ac, security_deposit, rules
      } = req.body;

      // Get owner ID from authenticated user (from JWT token)
      const ownerId = req.user?.id || req.body.owner_id;

      if (!ownerId) {
        return res.status(400).json({
          success: false,
          message: 'Owner authentication required',
          errors: ['Owner ID missing from authentication or request body']
        });
      }

      // Validate required fields
      const requiredFields = { name, location, price, gender, city };
      const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          errors: missingFields.map(field => `${field} is required`)
        });
      }

      // Validate PG listing data
      const validationErrors = this.pgListingService.validatePGListingData(req.body);

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      // Add PG listing (owner should already be registered)
      const result = await this.pgListingService.addPGListing(ownerId, {
        name,
        location,
        address: address || location,
        city,
        price,
        security_deposit,
        amenities: Array.isArray(amenities) ? amenities : [],
        gender,
        room_type,
        available_rooms: available_rooms || 1,
        total_rooms: total_rooms || 1,
        images: Array.isArray(images) ? images : [],
        description,
        rules: Array.isArray(rules) ? rules : [],
        contact_phone,
        contact_email,
        wifi: wifi || false,
        parking: parking || false,
        laundry: laundry || false,
        food_included: food_included || false,
        ac: ac || false
      });

      return res.status(201).json({
        success: true,
        message: result.message,
        data: {
          pgListing: result.pgListing
        }
      });

    } catch (error) {
      console.error('❌ Add PG listing error:', error.message);

      if (error.message.includes('not registered as an owner')) {
        return res.status(400).json({
          success: false,
          message: 'Owner registration required',
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to add PG listing',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Add new PG listing with images
  addPGListingWithImages = async (req, res) => {
    try {
      const {
        name, location, price, amenities, gender,
        city, address, room_type, available_rooms, total_rooms,
        description, contact_phone, contact_email, wifi, parking,
        laundry, food_included, ac, security_deposit, rules
      } = req.body;

      // Get owner ID from authenticated user
      const ownerId = req.user?.id;

      if (!ownerId) {
        return res.status(400).json({
          success: false,
          message: 'Owner authentication required',
          errors: ['Owner ID missing from authentication']
        });
      }

      // Handle uploaded images
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        imageUrls = req.files.map(file => 
          getFileUrl(req, path.join('pg-listings', file.filename))
        );
      }

      // Validate required fields
      const requiredFields = { name, location, price, gender, city };
      const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key]);

      if (missingFields.length > 0) {
        // Cleanup uploaded files if validation fails
        if (req.files) {
          cleanupFiles(req.files);
        }
        
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          errors: missingFields.map(field => `${field} is required`)
        });
      }

      // Validate PG listing data
      const validationErrors = this.pgListingService.validatePGListingData(req.body);

      if (validationErrors.length > 0) {
        // Cleanup uploaded files if validation fails
        if (req.files) {
          cleanupFiles(req.files);
        }
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      // Add PG listing with images
      const result = await this.pgListingService.addPGListing(ownerId, {
        name,
        location,
        address: address || location,
        city,
        price,
        security_deposit,
        amenities: Array.isArray(amenities) ? amenities : [],
        gender,
        room_type,
        available_rooms: available_rooms || 1,
        total_rooms: total_rooms || 1,
        images: imageUrls, // Use uploaded image URLs
        description,
        rules: Array.isArray(rules) ? rules : [],
        contact_phone,
        contact_email,
        wifi: wifi || false,
        parking: parking || false,
        laundry: laundry || false,
        food_included: food_included || false,
        ac: ac || false
      });

      return res.status(201).json({
        success: true,
        message: result.message,
        data: {
          pgListing: result.pgListing,
          uploadedImages: req.files ? req.files.map(file => ({
            filename: file.filename,
            url: getFileUrl(req, path.join('pg-listings', file.filename)),
            size: file.size
          })) : []
        }
      });

    } catch (error) {
      // Cleanup uploaded files if error occurs
      if (req.files) {
        cleanupFiles(req.files);
      }

      console.error('❌ Add PG listing with images error:', error.message);

      if (error.message.includes('not registered as an owner')) {
        return res.status(400).json({
          success: false,
          message: 'Owner registration required',
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to add PG listing with images',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Get all PG listings
  getAllPGListings = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        city,
        gender,
        minPrice,
        maxPrice,
        amenities,
        roomType,
        search,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      // Parse amenities if provided as string
      let parsedAmenities = amenities;
      if (typeof amenities === 'string') {
        try {
          parsedAmenities = JSON.parse(amenities);
        } catch {
          parsedAmenities = amenities.split(',').map(a => a.trim());
        }
      }

      const filters = {
        page: parseInt(page),
        limit: parseInt(limit),
        city,
        gender,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        amenities: parsedAmenities,
        roomType,
        search,
        sortBy,
        sortOrder
      };

      const result = await this.pgListingService.getAllPGListings(filters);

      return res.status(200).json({
        success: true,
        message: 'PG listings retrieved successfully',
        data: {
          pgListings: result.pgListings,
          pagination: result.pagination
        }
      });

    } catch (error) {
      console.error('❌ Get PG listings error:', error.message);

      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve PG listings',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Get PG listing by name
  getPGListingByName = async (req, res) => {
    try {
      const { name } = req.params;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'PG listing name is required'
        });
      }

      const pgListing = await this.pgListingService.getPGListingByName(name);

      return res.status(200).json({
        success: true,
        message: 'PG listing retrieved successfully',
        data: {
          pgListing
        }
      });

    } catch (error) {
      console.error('❌ Get PG listing error:', error.message);

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'PG listing not found',
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve PG listing',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Get PG listing by ID (for pg-details/:id route)
  getPGListingById = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'PG listing ID is required'
        });
      }

      const pgListing = await this.pgListingService.getPGListingById(id);

      return res.status(200).json({
        success: true,
        message: 'PG listing details retrieved successfully',
        data: {
          pgListing
        }
      });

    } catch (error) {
      console.error('❌ Get PG listing by ID error:', error.message);

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'PG listing not found',
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve PG listing details',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };
}

module.exports = PGListingController;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../config/database');

class OwnerService {
  constructor() {
    this.ownerRepository = AppDataSource.getRepository('Owner');
  }

  // Register new owner
  async registerOwner(ownerData) {
    try {
      const { name, email, password } = ownerData;

      // Check if owner already exists
      const existingOwner = await this.ownerRepository.findOne({
        where: { email }
      });

      if (existingOwner) {
        throw new Error('Owner with this email already exists');
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new owner with minimal required fields
      const newOwner = this.ownerRepository.create({
        name,
        email,
        password: hashedPassword,
        verification_status: 'pending'
      });

      // Save owner to database
      const savedOwner = await this.ownerRepository.save(newOwner);

      // Remove password from response and ensure id is included
      const { password: _, ...ownerWithoutPassword } = savedOwner;

      return {
        success: true,
        message: 'Owner registered successfully',
        owner: {
          id: savedOwner.id,
          name: savedOwner.name,
          email: savedOwner.email,
          phone: savedOwner.phone,
          business_name: savedOwner.business_name,
          business_address: savedOwner.business_address,
          verification_status: savedOwner.verification_status,
          is_active: savedOwner.is_active,
          created_at: savedOwner.created_at
        }
      };

    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Login owner
  async loginOwner({ email, password }) {
    try {
      // Find owner by email (include password for verification)
      const owner = await this.ownerRepository.findOne({
        where: { email },
        select: ['id', 'name', 'email', 'password', 'phone', 'business_name', 'business_address', 'verification_status', 'is_active', 'created_at']
      });

      if (!owner) {
        throw new Error('Invalid email or password');
      }

      // Check if owner is active
      if (!owner.is_active) {
        throw new Error('Account is deactivated. Please contact support.');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, owner.password);

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = this.generateOwnerToken(owner);

      // Remove password from response and ensure id is included
      return {
        success: true,
        message: 'Login successful',
        owner: {
          id: owner.id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone,
          business_name: owner.business_name,
          business_address: owner.business_address,
          verification_status: owner.verification_status,
          is_active: owner.is_active,
          created_at: owner.created_at
        },
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      };

    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Generate JWT token for owner
  generateOwnerToken(owner) {
    const payload = {
      id: owner.id,
      email: owner.email,
      name: owner.name,
      type: 'owner', // Distinguish from user tokens
      business_name: owner.business_name
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'pg-management-owner'
      }
    );
  }

  // Verify JWT token
  verifyOwnerToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Find owner by email
  async findOwnerByEmail(email) {
    try {
      return await this.ownerRepository.findOne({
        where: { email }
      });
    } catch (error) {
      throw new Error('Error finding owner');
    }
  }

  // Get owner by ID
  async getOwnerById(id) {
    try {
      const owner = await this.ownerRepository.findOne({
        where: { id }
      });

      if (!owner) {
        throw new Error('Owner not found');
      }

      // Remove password from response
      const { password: _, ...ownerWithoutPassword } = owner;
      return ownerWithoutPassword;

    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get all owners (admin function)
  async getAllOwners(limit = 50, offset = 0) {
    try {
      const [owners, total] = await this.ownerRepository.findAndCount({
        select: ['id', 'name', 'email', 'phone', 'business_name', 'business_address', 'verification_status', 'is_active', 'created_at'],
        take: limit,
        skip: offset,
        order: { created_at: 'DESC' }
      });

      return {
        owners,
        total,
        limit,
        offset
      };

    } catch (error) {
      throw new Error('Error fetching owners');
    }
  }

  // Update owner
  async updateOwner(id, updateData) {
    try {
      // Remove sensitive fields from update data (should be handled separately)
      const { password, email, ...safeUpdateData } = updateData;

      console.log('🔄 Updating owner with ID:', id);
      console.log('📝 Update data:', safeUpdateData);

      // Validate update data
      const validationErrors = this.validateOwnerUpdateData(safeUpdateData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Find the owner first
      const existingOwner = await this.ownerRepository.findOne({
        where: { id }
      });

      if (!existingOwner) {
        throw new Error('Owner not found');
      }

      console.log('👤 Found existing owner:', existingOwner.email);

      // Update the owner object directly
      Object.assign(existingOwner, safeUpdateData);
      
      // Save the updated owner
      const savedOwner = await this.ownerRepository.save(existingOwner);
      
      console.log('💾 Owner saved successfully');

      // Remove password from response
      const { password: _, ...ownerWithoutPassword } = savedOwner;
      return ownerWithoutPassword;

    } catch (error) {
      console.error('❌ Update owner error:', error.message);
      throw new Error(error.message);
    }
  }

  // Validate owner registration data
  validateOwnerRegistrationData({ name, email, password }) {
    const errors = [];

    // Name validation
    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push('Please provide a valid email address');
    }

    // Password validation
    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return errors;
  }

  // Validate login data
  validateOwnerLoginData({ email, password }) {
    const errors = [];

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push('Please provide a valid email address');
    }

    // Password validation
    if (!password || password.length < 1) {
      errors.push('Password is required');
    }

    return errors;
  }

  // 🏠 OWNER DASHBOARD FEATURES 🏠

  // Get owner dashboard analytics
  async getOwnerDashboard(ownerId) {
    try {
      const pgListingRepository = AppDataSource.getRepository('PGListing');
      
      // Get owner info
      const owner = await this.getOwnerById(ownerId);
      
      // Get all owner's PG listings
      const pgListings = await pgListingRepository.find({
        where: { owner_id: ownerId },
        order: { created_at: 'DESC' }
      });

      // Calculate analytics
      const totalListings = pgListings.length;
      const activeListings = pgListings.filter(pg => pg.is_active).length;
      const inactiveListings = totalListings - activeListings;
      
      // Calculate total rooms and available rooms
      const totalRooms = pgListings.reduce((sum, pg) => sum + (pg.total_rooms || 0), 0);
      const availableRooms = pgListings.reduce((sum, pg) => sum + (pg.available_rooms || 0), 0);
      const occupiedRooms = totalRooms - availableRooms;
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

      // Calculate price analytics
      const prices = pgListings.map(pg => parseFloat(pg.price)).filter(price => price > 0);
      const avgPrice = prices.length > 0 ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length) : 0;
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

      // Group by city
      const citiesData = pgListings.reduce((acc, pg) => {
        const city = pg.city || 'Unknown';
        if (!acc[city]) {
          acc[city] = { count: 0, totalRooms: 0, availableRooms: 0 };
        }
        acc[city].count++;
        acc[city].totalRooms += pg.total_rooms || 0;
        acc[city].availableRooms += pg.available_rooms || 0;
        return acc;
      }, {});

      // Recent listings (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentListings = pgListings.filter(pg => new Date(pg.created_at) >= thirtyDaysAgo);

      // Gender distribution
      const genderStats = pgListings.reduce((acc, pg) => {
        const gender = pg.gender || 'unknown';
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
      }, {});

      return {
        owner,
        analytics: {
          listings: {
            total: totalListings,
            active: activeListings,
            inactive: inactiveListings,
            recentlyAdded: recentListings.length
          },
          rooms: {
            total: totalRooms,
            available: availableRooms,
            occupied: occupiedRooms,
            occupancyRate: `${occupancyRate}%`
          },
          pricing: {
            average: avgPrice,
            minimum: minPrice,
            maximum: maxPrice
          },
          locations: Object.keys(citiesData).map(city => ({
            city,
            listings: citiesData[city].count,
            totalRooms: citiesData[city].totalRooms,
            availableRooms: citiesData[city].availableRooms
          })),
          genderDistribution: genderStats
        },
        recentListings: recentListings.slice(0, 5).map(pg => ({
          id: pg.id,
          name: pg.name,
          city: pg.city,
          price: pg.price,
          available_rooms: pg.available_rooms,
          created_at: pg.created_at
        }))
      };

    } catch (error) {
      throw new Error(`Error fetching owner dashboard: ${error.message}`);
    }
  }

  // Get owner's PG listings with advanced filters
  async getOwnerPGListings(ownerId, filters = {}) {
    try {
      const pgListingRepository = AppDataSource.getRepository('PGListing');
      const {
        page = 1,
        limit = 10,
        status = 'all', // all, active, inactive
        city,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = filters;

      const offset = (page - 1) * limit;

      let queryBuilder = pgListingRepository
        .createQueryBuilder('pg')
        .where('pg.owner_id = :ownerId', { ownerId });

      // Filter by status
      if (status === 'active') {
        queryBuilder.andWhere('pg.is_active = :isActive', { isActive: true });
      } else if (status === 'inactive') {
        queryBuilder.andWhere('pg.is_active = :isActive', { isActive: false });
      }

      // Filter by city
      if (city) {
        queryBuilder.andWhere('LOWER(pg.city) LIKE LOWER(:city)', { city: `%${city}%` });
      }

      // Apply sorting
      queryBuilder.orderBy(`pg.${sortBy}`, sortOrder);

      // Apply pagination
      queryBuilder.skip(offset).take(parseInt(limit));

      const [pgListings, total] = await queryBuilder.getManyAndCount();

      return {
        pgListings,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };

    } catch (error) {
      throw new Error(`Error fetching owner PG listings: ${error.message}`);
    }
  }

  // Update PG listing status (activate/deactivate)
  async updatePGListingStatus(ownerId, pgId, isActive) {
    try {
      const pgListingRepository = AppDataSource.getRepository('PGListing');
      
      const pgListing = await pgListingRepository.findOne({
        where: { id: pgId, owner_id: ownerId }
      });

      if (!pgListing) {
        throw new Error('PG listing not found or you do not have permission to modify it');
      }

      pgListing.is_active = isActive;
      await pgListingRepository.save(pgListing);

      return {
        success: true,
        message: `PG listing ${isActive ? 'activated' : 'deactivated'} successfully`,
        pgListing: {
          id: pgListing.id,
          name: pgListing.name,
          is_active: pgListing.is_active
        }
      };

    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get business performance metrics
  async getBusinessMetrics(ownerId) {
    try {
      const pgListingRepository = AppDataSource.getRepository('PGListing');
      
      const pgListings = await pgListingRepository.find({
        where: { owner_id: ownerId }
      });

      // Calculate monthly revenue potential
      const monthlyRevenue = pgListings.reduce((total, pg) => {
        const occupiedRooms = (pg.total_rooms || 0) - (pg.available_rooms || 0);
        return total + (occupiedRooms * parseFloat(pg.price || 0));
      }, 0);

      // Performance by city
      const cityPerformance = pgListings.reduce((acc, pg) => {
        const city = pg.city || 'Unknown';
        if (!acc[city]) {
          acc[city] = { 
            listings: 0, 
            totalRooms: 0, 
            occupiedRooms: 0, 
            revenue: 0 
          };
        }
        
        const occupiedRooms = (pg.total_rooms || 0) - (pg.available_rooms || 0);
        acc[city].listings++;
        acc[city].totalRooms += pg.total_rooms || 0;
        acc[city].occupiedRooms += occupiedRooms;
        acc[city].revenue += occupiedRooms * parseFloat(pg.price || 0);
        
        return acc;
      }, {});

      return {
        monthlyRevenue: Math.round(monthlyRevenue),
        totalProperties: pgListings.length,
        verificationStatus: await this.getOwnerById(ownerId).then(owner => owner.verification_status),
        cityPerformance: Object.keys(cityPerformance).map(city => ({
          city,
          ...cityPerformance[city],
          occupancyRate: cityPerformance[city].totalRooms > 0 
            ? Math.round((cityPerformance[city].occupiedRooms / cityPerformance[city].totalRooms) * 100) 
            : 0
        }))
      };

    } catch (error) {
      throw new Error(`Error fetching business metrics: ${error.message}`);
    }
  }

  // Validate owner update data
  validateOwnerUpdateData(updateData) {
    const errors = [];

    // Name validation
    if (updateData.name && updateData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Phone validation
    if (updateData.phone && updateData.phone.length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }

    // Business name validation
    if (updateData.business_name && updateData.business_name.trim().length < 2) {
      errors.push('Business name must be at least 2 characters long');
    }

    // Business address validation
    if (updateData.business_address && updateData.business_address.length > 1000) {
      errors.push('Business address must not exceed 1000 characters');
    }

    // Verification status validation
    if (updateData.verification_status && !['pending', 'verified', 'rejected'].includes(updateData.verification_status)) {
      errors.push('Verification status must be one of: pending, verified, rejected');
    }

    // Documents validation
    if (updateData.documents && !Array.isArray(updateData.documents)) {
      errors.push('Documents must be an array');
    }

    // Profile image validation
    if (updateData.profile_image && typeof updateData.profile_image !== 'string') {
      errors.push('Profile image must be a valid URL string');
    }

    // Active status validation
    if (updateData.is_active !== undefined && typeof updateData.is_active !== 'boolean') {
      errors.push('Active status must be a boolean');
    }

    return errors;
  }
}

module.exports = OwnerService;

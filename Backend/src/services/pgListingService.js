const { AppDataSource } = require('../config/database');

class PGListingService {
  constructor() {
    this.pgListingRepository = AppDataSource.getRepository('PGListing');
    this.ownerRepository = AppDataSource.getRepository('Owner');
  }

  // Add new PG listing
  async addPGListing(ownerId, pgData) {
    try {
      // Verify owner exists
      const owner = await this.ownerRepository.findOne({
        where: { id: ownerId }
      });

      if (!owner) {
        throw new Error('Owner not found. Please ensure you are registered as an owner.');
      }

      // Create new PG listing
      const newPGListing = this.pgListingRepository.create({
        owner_id: ownerId,
        name: pgData.name,
        location: pgData.location,
        address: pgData.address || pgData.location,
        city: pgData.city,
        state: pgData.state || 'Unknown',
        pincode: pgData.pincode || '000000',
        price: parseFloat(pgData.price),
        security_deposit: pgData.security_deposit ? parseFloat(pgData.security_deposit) : null,
        amenities: pgData.amenities || [],
        gender: pgData.gender,
        room_type: pgData.room_type || 'single',
        available_rooms: pgData.available_rooms || 1,
        total_rooms: pgData.total_rooms || 1,
        images: pgData.images || [],
        description: pgData.description || '',
        rules: pgData.rules || [],
        contact_phone: pgData.contact_phone,
        contact_email: pgData.contact_email,
        wifi: pgData.wifi || false,
        parking: pgData.parking || false,
        laundry: pgData.laundry || false,
        food_included: pgData.food_included || false,
        ac: pgData.ac || false,
        latitude: pgData.latitude || null,
        longitude: pgData.longitude || null
      });

      // Save PG listing
      const savedPGListing = await this.pgListingRepository.save(newPGListing);

      return {
        success: true,
        message: 'PG listing added successfully',
        pgListing: savedPGListing
      };

    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get all PG listings with pagination and filters
  async getAllPGListings(filters = {}) {
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
      } = filters;

      // Calculate offset
      const offset = (page - 1) * limit;

      // Build query
      let queryBuilder = this.pgListingRepository
        .createQueryBuilder('pg')
        .where('pg.is_active = :isActive', { isActive: true });

      // Apply filters
      if (city) {
        queryBuilder.andWhere('LOWER(pg.city) LIKE LOWER(:city)', { city: `%${city}%` });
      }

      if (gender && gender !== 'both') {
        queryBuilder.andWhere('(pg.gender = :gender OR pg.gender = :both)', { 
          gender, 
          both: 'both' 
        });
      }

      if (minPrice) {
        queryBuilder.andWhere('pg.price >= :minPrice', { minPrice: parseFloat(minPrice) });
      }

      if (maxPrice) {
        queryBuilder.andWhere('pg.price <= :maxPrice', { maxPrice: parseFloat(maxPrice) });
      }

      if (roomType) {
        queryBuilder.andWhere('pg.room_type = :roomType', { roomType });
      }

      if (amenities && amenities.length > 0) {
        queryBuilder.andWhere('pg.amenities && :amenities', { amenities });
      }

      if (search) {
        queryBuilder.andWhere(
          '(LOWER(pg.name) LIKE LOWER(:search) OR LOWER(pg.location) LIKE LOWER(:search) OR LOWER(pg.city) LIKE LOWER(:search))',
          { search: `%${search}%` }
        );
      }

      // Apply sorting
      queryBuilder.orderBy(`pg.${sortBy}`, sortOrder);

      // Apply pagination
      queryBuilder.skip(offset).take(parseInt(limit));

      // Execute query
      const [pgListings, total] = await queryBuilder.getManyAndCount();

      // Format response
      const formattedListings = pgListings.map(listing => ({
        id: listing.id,
        name: listing.name,
        location: listing.location,
        address: listing.address,
        city: listing.city,
        state: listing.state,
        price: listing.price,
        security_deposit: listing.security_deposit,
        amenities: listing.amenities,
        gender: listing.gender,
        room_type: listing.room_type,
        available_rooms: listing.available_rooms,
        total_rooms: listing.total_rooms,
        images: listing.images,
        description: listing.description,
        contact_phone: listing.contact_phone,
        contact_email: listing.contact_email,
        wifi: listing.wifi,
        parking: listing.parking,
        laundry: listing.laundry,
        food_included: listing.food_included,
        ac: listing.ac,
        owner_id: listing.owner_id,
        created_at: listing.created_at
      }));

      return {
        pgListings: formattedListings,
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
      throw new Error('Error fetching PG listings');
    }
  }

  // Get PG listing by ID
  async getPGListingById(id) {
    try {
      const pgListing = await this.pgListingRepository
        .createQueryBuilder('pg')
        .where('pg.id = :id', { id })
        .andWhere('pg.is_active = :isActive', { isActive: true })
        .getOne();

      if (!pgListing) {
        throw new Error('PG listing not found');
      }

      return {
        id: pgListing.id,
        name: pgListing.name,
        location: pgListing.location,
        address: pgListing.address,
        city: pgListing.city,
        state: pgListing.state,
        pincode: pgListing.pincode,
        price: pgListing.price,
        security_deposit: pgListing.security_deposit,
        amenities: pgListing.amenities,
        gender: pgListing.gender,
        room_type: pgListing.room_type,
        available_rooms: pgListing.available_rooms,
        total_rooms: pgListing.total_rooms,
        images: pgListing.images,
        description: pgListing.description,
        rules: pgListing.rules,
        contact_phone: pgListing.contact_phone,
        contact_email: pgListing.contact_email,
        wifi: pgListing.wifi,
        parking: pgListing.parking,
        laundry: pgListing.laundry,
        food_included: pgListing.food_included,
        ac: pgListing.ac,
        latitude: pgListing.latitude,
        longitude: pgListing.longitude,
        owner_id: pgListing.owner_id,
        created_at: pgListing.created_at,
        updated_at: pgListing.updated_at
      };

    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get PG listing by name
  async getPGListingByName(name) {
    try {
      const pgListing = await this.pgListingRepository
        .createQueryBuilder('pg')
        .where('LOWER(pg.name) = LOWER(:name)', { name })
        .andWhere('pg.is_active = :isActive', { isActive: true })
        .getOne();

      if (!pgListing) {
        throw new Error('PG listing not found');
      }

      return {
        id: pgListing.id,
        name: pgListing.name,
        location: pgListing.location,
        address: pgListing.address,
        city: pgListing.city,
        state: pgListing.state,
        pincode: pgListing.pincode,
        price: pgListing.price,
        security_deposit: pgListing.security_deposit,
        amenities: pgListing.amenities,
        gender: pgListing.gender,
        room_type: pgListing.room_type,
        available_rooms: pgListing.available_rooms,
        total_rooms: pgListing.total_rooms,
        images: pgListing.images,
        description: pgListing.description,
        rules: pgListing.rules,
        contact_phone: pgListing.contact_phone,
        contact_email: pgListing.contact_email,
        wifi: pgListing.wifi,
        parking: pgListing.parking,
        laundry: pgListing.laundry,
        food_included: pgListing.food_included,
        ac: pgListing.ac,
        latitude: pgListing.latitude,
        longitude: pgListing.longitude,
        owner_id: pgListing.owner_id,
        created_at: pgListing.created_at,
        updated_at: pgListing.updated_at
      };

    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Validate PG listing data
  validatePGListingData(pgData) {
    const errors = [];

    // Name validation
    if (!pgData.name || pgData.name.trim().length < 3) {
      errors.push('PG name must be at least 3 characters long');
    }

    // Location validation
    if (!pgData.location || pgData.location.trim().length < 5) {
      errors.push('Location must be at least 5 characters long');
    }

    // Price validation
    if (!pgData.price || isNaN(pgData.price) || parseFloat(pgData.price) <= 0) {
      errors.push('Price must be a valid positive number');
    }

    // Gender validation
    if (!pgData.gender || !['male', 'female', 'both'].includes(pgData.gender)) {
      errors.push('Gender must be one of: male, female, both');
    }

    // City validation
    if (!pgData.city || pgData.city.trim().length < 2) {
      errors.push('City is required and must be at least 2 characters');
    }

    return errors;
  }
}

module.exports = PGListingService;

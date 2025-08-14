const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../config/database');

class UserService {
  constructor() {
    this.userRepository = AppDataSource.getRepository('User');
  }
  // Register new user
  async registerUser({ name, email, password }) {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email }
      });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      // Create new user
      const newUser = this.userRepository.create({
        name,
        email,
        password: hashedPassword
      });
      // Save user to database
      const savedUser = await this.userRepository.save(newUser);
      // Remove password from response
      const { password: _, ...userWithoutPassword } = savedUser;
      return {
        success: true,
        message: 'User registered successfully',
        user: userWithoutPassword
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // Login user
  async loginUser({ email, password }) {
    try {
      // Find user by email (include password for verification)
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'name', 'email', 'password', 'phone', 'gender', 'occupation', 'profile_image', 'is_active', 'created_at']
      });
      if (!user) {
        throw new Error('Invalid email or password');
      }
      // Check if user is active
      if (!user.is_active) {
        throw new Error('Account is deactivated. Please contact support.');
      }
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }
      // Generate JWT token
      const token = this.generateToken(user);
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Generate JWT token
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name
    };
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'pg-management-system'
      }
    );
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Find user by email
  async findUserByEmail(email) {
    try {
      return await this.userRepository.findOne({
        where: { email }
      });
    } catch (error) {
      throw new Error('Error finding user');
    }
  }

  // Find user by ID
  async findUserById(id) {
    try {
      const user = await this.userRepository.findOne({
        where: { id }
      });
      if (!user) {
        throw new Error('User not found');
      }
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get all users (admin function)
  async getAllUsers(limit = 50, offset = 0) {
    try {
      const [users, total] = await this.userRepository.findAndCount({
        select: ['id', 'name', 'email', 'phone', 'gender', 'occupation', 'is_active', 'created_at'],
        take: limit,
        skip: offset,
        order: { created_at: 'DESC' }
      });
      return {
        users,
        total,
        limit,
        offset
      };
    } catch (error) {
      throw new Error('Error fetching users');
    }
  }

  // Update user
  async updateUser(id, updateData) {
    try {
      // Remove password from update data (should be handled separately)
      const { password, ...safeUpdateData } = updateData;
      const result = await this.userRepository.update(id, safeUpdateData);
      if (result.affected === 0) {
        throw new Error('User not found');
      }
      // Return updated user
      return await this.findUserById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Validate user registration data
  validateRegistrationData({ name, email, password }) {
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
  validateLoginData({ email, password }) {
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
}

module.exports = UserService;

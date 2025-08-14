const { DataSource } = require('typeorm');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Owner = require('../models/Owner');
const PGListing = require('../models/PGListing');

// TypeORM DataSource configuration
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in development
  logging: false, // Disable SQL query logging
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  entities: [User, Owner, PGListing],
  migrations: ['src/migrations/*.js'],
  subscribers: ['src/subscribers/*.js'],
});

// Initialize database connection
const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ TypeORM connected to PostgreSQL successfully');
    console.log('🗄️ Database synchronized');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { AppDataSource, connectDB };

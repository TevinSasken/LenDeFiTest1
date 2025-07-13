import dotenv from 'dotenv';
import { connectDatabase } from '../config/database';
import db from '../models';

// Load test environment variables
dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  // Connect to test database
  await connectDatabase();
  
  // Sync database (create tables)
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection
  await db.sequelize.close();
});

beforeEach(async () => {
  // Clean up database before each test
  await db.sequelize.truncate({ cascade: true });
});
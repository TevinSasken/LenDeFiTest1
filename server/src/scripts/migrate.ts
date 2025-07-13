import { connectDatabase } from '../config/database';
import db from '../models';

const runMigrations = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // Connect to database
    await connectDatabase();
    
    // Sync all models (create tables if they don't exist)
    await db.sequelize.sync({ alter: true });
    
    console.log('✅ Database migration completed successfully');
    
    // Close connection
    await db.sequelize.close();
    console.log('🔌 Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
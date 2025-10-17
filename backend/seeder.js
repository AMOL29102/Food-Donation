import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    // Delete any existing admin user to ensure a clean slate
    await User.deleteOne({ email: 'admin@foodrescue.com' });
    console.log('ℹ️  Cleaned up old admin account (if any).');

    // Create the new admin user
    await User.create({
      name: 'System Admin',
      email: 'admin@gmail.com',
      password: 'admin',
      role: 'admin',
      pincode: '000000',
      mobile: '9999999999',
      isApproved: true
    });
    console.log('✅ Admin user created successfully with a fresh hashed password.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

createAdmin();
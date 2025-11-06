import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/user.js';

const resetPassword = async (email, newPassword) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log(`✅ Password reset successful for ${email}`);
    console.log(`New password: ${newPassword}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Get email and password from command line args
const email = process.argv[2];
const password = process.argv[3] || 'password123';

if (!email) {
  console.log('Usage: node reset-password.js <email> [new-password]');
  console.log('Example: node reset-password.js ashish@gmail.com test123');
  process.exit(1);
}

resetPassword(email, password);


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/user.js';
import Farmer from '../models/Farmer.js';
import Buyer from '../models/Buyer.js';

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'test@test.com';
    const password = 'test123';
    const name = 'Test User';
    const role = 'farmer'; // or 'buyer'

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      console.log('User already exists, updating password...');
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
      console.log('✅ Password updated');
    } else {
      console.log('Creating new user...');
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({ name, email, password: hashedPassword });
      console.log('✅ User created');
    }

    // Check/create role profile
    if (role === 'farmer') {
      let farmer = await Farmer.findOne({ userId: user._id });
      if (!farmer) {
        await Farmer.create({ userId: user._id });
        console.log('✅ Farmer profile created');
      } else {
        console.log('✅ Farmer profile already exists');
      }
    } else if (role === 'buyer') {
      let buyer = await Buyer.findOne({ userId: user._id });
      if (!buyer) {
        await Buyer.create({ userId: user._id });
        console.log('✅ Buyer profile created');
      } else {
        console.log('✅ Buyer profile already exists');
      }
    }

    console.log('\n✅ Test user ready!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${role}`);
    console.log('\nYou can now login with these credentials.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createTestUser();


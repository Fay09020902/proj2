require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createHRUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = 'hr@company.com';
    const username = 'hrmanager';
    const plainPassword = 'hrpassword123';

    // check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('HR user already exists!');
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const hrUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: true // 🔐 acts as HR role
    });

    await hrUser.save();
    console.log('✅ HR user created successfully:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${plainPassword}`);

    process.exit(0);
  } catch (err) {
    console.error('Failed to create HR user:', err);
    process.exit(1);
  }
};

createHRUser();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const gravatar = require('gravatar');
const User = require('../models/User');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET;


// 🟢 Frontend: Validate token before showing form
exports.validateRegistrationToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Token is missing from header' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered with this email. Please Signin' });
    }
    res.status(200).json({ email: decoded.email });
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Link expired' : 'Invalid token';
    res.status(400).json({ message: msg });
  }
};


// 🟢 Register user using token
exports.registerUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  const { username, password } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

    const user = new User({
      email,
      username,
      password: hashed,
      avatar,
      isVerified: true
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Link expired' : 'Invalid or expired link';
    res.status(400).json({ message: msg });
  }
};

// 🟡 Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = {
      user: {
        id: user._id,
        isAdmin: user.isAdmin
      }
    };

    const token = jwt.sign(payload, JWT_SECRET);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        onboardingStatus: user.onboardingStatus,
        feedback: user.feedback
      },
      expiresIn: 3600
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

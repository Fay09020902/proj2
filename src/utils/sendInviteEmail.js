const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const sendInviteEmail = async (email, reset = false) => {
  const token = jwt.sign({ email }, JWT_SECRET);
  //console.log("🔐 JWT_SECRET in use sendinvideemail:", process.env.JWT_SECRET);

  const link = reset
              ?`http://localhost:5173/update-password/${token}`
              :`http://localhost:5173/register/${token}`;


  const html = reset
  ? `
      <h2>Password Reset 🔐</h2>
      <p>Click the link below to reset your password. This link is valid for 15 minutes.</p>
      <a href="${link}">${link}</a>
    `
  : `
      <h2>Complete Your Registration 🎉</h2>
      <p>Click below to complete your registration. This link is valid for 3 hours.</p>
      <a href="${link}">${link}</a>
    `;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PWD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: 'fyj121322@gmail.com',
    subject: reset? 'Reset Your Password': 'Complete Your Registration',
    html
  });

  return token;
};

module.exports = sendInviteEmail;

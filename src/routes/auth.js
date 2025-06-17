const express = require('express');
const router = express.Router();
const {
  validateRegistrationToken,
  loginUser,
} = require('../controllers/auth');

// // Employee requests access
// router.post('/request-access', requestAccess);

// Validate token before showing form
router.post('/validate-token', validateRegistrationToken);

// Login
router.post('/login', loginUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  validateRegistrationToken,
  loginUser,
  requestAccess
} = require('../controllers/auth');

// Employee requests access
router.post('/request-access', requestAccess);

// Validate token before showing form
router.post('/validate-token', validateRegistrationToken);

// Login
router.post('/login', loginUser);


// {
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjgwNGJkNGY2YWY3NTgzYzAxYjcxMWZkIiwiaXNBZG1pbiI6dHJ1ZX0sImlhdCI6MTc0NTE0MTQyOCwiZXhwIjoxNzQ1MTQ1MDI4fQ.yf8T_2eQcfFQEKpwTl45mHcccjgO5wkkaY76NIS6AXc",
//   "user": {
//       "id": "6804bd4f6af7583c01b711fd",
//       "username": "hrmanager",
//       "email": "hr@company.com",
//       "isAdmin": true,
//       "avatar": "//www.gravatar.com/avatar/9fef307a53387ac0f82222b61649af04?s=200&r=pg&d=mm"
//   },
//   "expiresIn": 3600
// }

module.exports = router;

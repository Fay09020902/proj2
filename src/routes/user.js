const express = require('express');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth')
const isHR = require('../middleware/isHR')

const {
registerUser,
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateUserInfo,
  searchUsersByName,
  sendResetEmail,
  updatePassword
} = require('../controllers/user');

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    }
    catch (err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// Register with token
router.post('/register', registerUser);

// ✅ Get all employees (HR only)
router.get('/', auth, isHR, getAllUsers);

// ✅ Get current logged-in user's info
router.get('/me', auth, getCurrentUser);

// ✅ Get one user by ID (HR only)
router.get('/:id', auth, isHR, getUserById);

// ✅ Update personal info
router.put('/:id', auth, updateUserInfo);

//✅ send password
router.post('/reset-password', sendResetEmail);

//✅ update password
router.post('/update-password', updatePassword);

// ✅ Search user by name (HR only)
router.get('/search/name', auth, isHR, searchUsersByName);

module.exports = router;

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendInviteEmail = require('../utils/sendInviteEmail')
const jwt = require('jsonwebtoken');
const RegistrationInvite = require('../models/RegistrationInvite')


// ✅ GET /api/users (HR only)
exports.getAllUsers = async (req, res) => {
  try {
    const employees = await User.find({ isAdmin: false }).select('-password');
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET /api/users/me
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    console.log("user phili", user)
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET /api/users/:id (HR only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

//register user

exports.registerUser = async (req, res) => {
  const { username, password, email, token } = req.body;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.email !== email) return res.status(400).json({ message: 'Invalid token or email mismatch' });

    const invite = await RegistrationInvite.findOne({ email });
    if (!invite || invite.status !== 'invited') {
      return res.status(400).json({ message: 'No valid invite found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    invite.status = 'registered';
    await invite.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    // console.error(err);
    res.status(400).json({ message: err.errmsg });
  }
};

// ✅ PATCH /api/users/:id (user edits self)
exports.updateUserInfo = async (req, res) => {
  try {
    const allowedUpdates = [
      'username', 'email', 'avatar', 'isVerified'
      // You can expand this based on allowed fields
    ];
    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ POST /api/users/update-password
exports.updatePassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: `Token and new password are required.${token}, ${newPassword}` });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: `Server error${req.body.password}, ${err}` });
  }
};


// ✅ DELETE /api/users/:id (HR/Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET /api/users/search/name?name=xxx (HR only)
exports.searchUsersByName = async (req, res) => {
  const searchName = req.query.name;
  if (!searchName) return res.status(400).json({ message: 'Name query is required' });

  try {
    const regex = new RegExp(searchName, 'i'); // case-insensitive search
    const results = await User.find({
      isAdmin: false,
      $or: [
        { username: regex },
        { email: regex }
        // add more fields like preferredName if needed
      ]
    }).select('-password');

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

//set reset password email
exports.sendResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await User.findOne({ email });
    if (!exists) return res.status(400).json({ message: 'User not registered' });
    // Send reset password email
    const rslt = await sendInviteEmail(email, reset = true);
    res.status(200).json(rslt)
  } catch (err) {
    res.status(500).json({  message: 'Failed to send reset password email.', error: err.message });
  }
}

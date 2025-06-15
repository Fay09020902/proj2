const EmployeeProfile = require('../models/EmployeeProfile');
const User = require('../models/User')
const Document = require('../models/Document');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.getProfile = async (req, res) => {
    try {
      const { userId } = req.params;
        const profile = await EmployeeProfile.findOne({ userId }).populate('documents');;
        res.json(profile)
    } catch(err) {
         res.status(500).json({ message: err.errmsg });
    }
}


exports.updateProfile = async (req, res) => {
  const { userId } = req.params;
  const updatedData = req.body;

  try {
    const profile = await EmployeeProfile.findOneAndUpdate({ userId }, updatedData, { new: true });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.submitProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const profile = await EmployeeProfile.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

     await User.findByIdAndUpdate(userId, {
      onboardingStatus: 'Pending',
    });

    const docs = await Document.find({ userId });
    profile.documents = docs.map(doc => doc._id);
    await profile.save();

    res.status(200).json({ message: 'Profile saved successfully', profile });
  } catch (err) {
    console.error('Submit profile error:', err);
    res.status(500).json({ message: 'Server error while submitting profile.' });
  }
}

const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');
const Document = require('../models/Document');

// GET all onboarding applications by status
exports.getApplicationsByStatus = async (req, res) => {

    try {
        const { status } = req.params;

    const users = await User.find({ onboardingStatus: status });

  const promises = users.map(async u => {
    const profile = await EmployeeProfile.findOne({ userId: u._id })
    return {
      userId: u._id,
      fullName: profile ? `${profile.firstName} ${profile.lastName}` : '',
      email: u.email,
      status: u.onboardingStatus,
    };
  });

  res.json(await Promise.all(promises));
    }
    catch(err){
       res.status(500).json({ message: err });
    }
};

exports.getApplicationByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = await EmployeeProfile.findOne({ userId }).populate('documents');

    res.status(200).json({
      userId: user._id,
      fullName: profile ? `${profile.firstName} ${profile.lastName}` : '',
      email: user.email,
      status: user.onboardingStatus,
      feedback: user.feedback || '',
      profile: profile || null
    });
  } catch (err) {
    console.error('Failed to fetch application:', err);
    res.status(500).json({ message: 'Application fetch failed', error: err.message });
  }
};

// PUT approve application
exports.approveOnboarding = async (req, res) => {
  try {
    const { userId } = req.body;

    await Document.updateMany(
      { userId, type: 'opt_receipt', status: 'Pending' },
      { $set: { status: 'Approved' } }
    );
    const user = await User.findByIdAndUpdate(
      userId,
      { onboardingStatus: 'Approved', feedback: '' },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Application approved', user });
  } catch (err) {
    console.error('Approval failed:', err);
    res.status(500).json({ message: 'Approval failed', error: err.message });
  }
};

// PUT reject application
exports.rejectOnboarding = async (req, res) => {
  try {
    const { userId, feedback } = req.body;

    if (!feedback || feedback.trim() === '') {
      return res.status(400).json({ message: 'Feedback is required for rejection' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { onboardingStatus: 'Rejected', feedback },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Application rejected', user });
  } catch (err) {
    console.error('Rejection failed:', err);
    res.status(500).json({ message: 'Rejection failed', error: err.message });
  }
};



// PUT /api/onboarding/update
exports.updateRejectedApplication = async (req, res) => {
  const { userId, formData } = req.body;
  const profile = await EmployeeProfile.findOne({ userId });
  const user = await User.findById(userId);

  if (user.onboardingStatus !== 'Rejected') {
    return res.status(400).json({ message: 'Only rejected applications can be updated' });
  }

  await EmployeeProfile.updateOne({ userId }, { $set: formData });
  user.onboardingStatus = 'Pending';
  user.feedback = '';
  await user.save();

  res.status(200).json({ message: 'Application updated and resubmitted' });
};

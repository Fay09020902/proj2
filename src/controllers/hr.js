const AccessRequest = require('../models/AccessRequest');
const sendInviteEmail = require('../utils/sendInviteEmail');
const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');
const RegistrationInvite = require('../models/RegistrationInvite')


// HR can view all access requests (pending, approved, rejected)
exports.getInvitesHistory = async (req, res) => {
    try {
      const requests = await RegistrationInvite.find().sort({ createdAt: -1 });
      res.status(200).json(requests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch invitation history' });
    }
  };


exports.getAllEmployeeProfiles = async (req, res) => {
  try {
    const profiles = await EmployeeProfile.find()
      .populate('userId', 'email onboardingStatus')
      .lean();

    res.status(200).json({ employees: profiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch employee profiles.' });
  }
};

exports.getEmployeeProfileById = async (req, res) => {
  try {
    const profile = await EmployeeProfile.findOne({ userId: req.params.id }).populate('userId');
    if (!profile) return res.status(404).json({ message: 'Employee not found' });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employee.' });
  }
};


exports.sendRegistrationLink = async (req, res) => {
    const { name, email } = req.body;

    try {
      // const request = await AccessRequest.findEmail(email);
      // if (!request) return res.status(404).json({ message: 'Request not found' });

      // Check if the user is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already registered with this email.' });
      }

      // Send or resend the invite
      const token = await sendInviteEmail(email, false);

      // Store or update invite
      await RegistrationInvite.findOneAndUpdate(
        { email },
        {
          name,
          email,
          token,
          status: 'invited',
        },
        { upsert: true, new: true }
      );

      res.status(200).json({
        message: 'Registration email sent.'
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to send invite email.' });
    }
  };

  exports.rejectAccessRequest = async (req, res) => {
    const { id } = req.params;

    try {
      const request = await AccessRequest.findById(id);
      if (!request) return res.status(404).json({ message: 'Request not found' });

      if (request.status !== 'pending') {
        return res.status(400).json({ message: `Cannot reject a request that is already ${request.status}` });
      }

      request.status = 'rejected';
      await request.save();

      res.status(200).json({ message: 'Access request rejected' });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to reject request' });
    }
  };

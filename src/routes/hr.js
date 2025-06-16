const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isHR = require('../middleware/isHR');

const {
  getInvitesHistory,
  sendRegistrationLink,
  getAllEmployeeProfiles,
  getEmployeeProfileById,
} = require('../controllers/hr');

const {
  getApplicationsByStatus,
  getApplicationByUserId,
  approveOnboarding,
  rejectOnboarding,
} = require('../controllers/onboarding')


const {
  hrVisaStatusAll,
  hrVisaStatusReview,
  sendReminder
} = require('../controllers/visa')

// GET /api/hr/invites - HR only
router.get('/invites', auth, isHR, getInvitesHistory);

//POST /api/hr/send-invite - HR only
router.post('/send-invite', auth, isHR, sendRegistrationLink)

//Get applications by onboardingStatus (pending, approved, rejected)
router.get('/hiring/applications/:status', getApplicationsByStatus );

router.get('/hiring/application/:userId', getApplicationByUserId );

router.put('/hiring/application/approve', approveOnboarding);

router.put('/hiring/application/reject', rejectOnboarding);


//visa related status
router.get('/visa-status/all', auth, isHR, hrVisaStatusAll);
router.put('/visa-status/review', auth, isHR, hrVisaStatusReview);
router.post('/visa-status/notify', auth, isHR, sendReminder);


router.get('/employees', auth, isHR, getAllEmployeeProfiles)
router.get('/employees/:id', auth, isHR, getEmployeeProfileById)


module.exports = router;

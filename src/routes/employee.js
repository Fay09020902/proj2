const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

const employeeController = require('../controllers/employee');
const {
  visaStatusByUserId
} = require('../controllers/visa')

router.get('/profile/:userId', auth, employeeController.getProfile);

router.post('/profile', auth, employeeController.submitProfile);

//获取当前用户所有签证文件状态
router.get('/visa-status/:userId', auth, visaStatusByUserId);

module.exports = router;

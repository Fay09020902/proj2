const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload')
const auth = require('../middleware/auth')
const isHR = require('../middleware/isHR');

const {
  uploadDocument,
  listDocuments,
  previewDocument,
   downloadDocument,
} = require('../controllers/document');

router.post('/upload', auth, upload.single('file'), uploadDocument);
router.get('/list/:userId', isHR, listDocuments);
router.get('/preview/:id', previewDocument);
router.get('/download/:id', downloadDocument);


module.exports = router;

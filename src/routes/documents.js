const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload')
const auth = require('../middleware/auth')

const {
  uploadDocument,
  listDocuments,
  previewDocument,
   downloadDocument,
//   deleteDocument
} = require('../controllers/document');

router.post('/upload', auth, upload.single('file'), uploadDocument);
router.get('/list/:userId', listDocuments);
router.get('/preview/:id', previewDocument);
router.get('/download/:id', downloadDocument);
// router.delete('/:id', deleteDocument);

module.exports = router;

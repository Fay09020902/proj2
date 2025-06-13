const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true, // actual filename stored on disk
  },
  fileUrl: {
    type: String,
    required: true, // URL used for frontend access or download
  },
  originalName: {
    type: String,
    required: true, // original uploaded file name
  },
  type: {
    type: String,
    required: true,
    enum: [
      'profile_picture',
      'drivers_license',
      'opt_receipt',
      'opt_ead',
      'i_983',
      'i_20'
    ],
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  feedback: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;

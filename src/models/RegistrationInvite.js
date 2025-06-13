const mongoose = require('mongoose');

const RegistrationInvite = new mongoose.Schema({
    name: {
        type: String,
    },
  email: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ["invited", "registered"],
    default: 'invited'
  },
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RegistrationInvite', RegistrationInvite);

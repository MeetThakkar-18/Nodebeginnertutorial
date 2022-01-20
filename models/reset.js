const mongoose = require('mongoose');

const resetSchema = new mongoose.Schema({
  email: {
    type: 'string',
    min: 6,
    max: 255,
    required: true,
  },
  otp: {
    type: 'string',
    min: 6,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 120,
    default: Date.now,
  },
});

module.exports = mongoose.model('Reset', resetSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      min: 3,
      max: 100,
      required: true,
    },

    lastname: {
      type: String,
      min: 3,
      max: 100,
      required: true,
    },

    email: {
      type: String,
      min: 6,
      max: 255,
      required: true,
    },
    password: {
      type: String,
      min: 6,
      max: 1024,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);

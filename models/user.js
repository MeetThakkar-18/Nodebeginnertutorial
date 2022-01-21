const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
      unique: true,
    },
    password: {
      type: String,
      min: 6,
      max: 1024,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword(password) {
  return bcrypt.compare(password, this.password);
};
module.exports = mongoose.model('User', UserSchema);

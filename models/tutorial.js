const mongoose = require('mongoose');

const TutorialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 3,
      maxlength: 100,
      required: true,
    },

    description: {
      type: String,
      minlength: 1,
      maxlength: 5000,
      required: true,
    },

    published: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TutorialPost', TutorialSchema);

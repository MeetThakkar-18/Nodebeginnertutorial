const jwt = require('jsonwebtoken');
const tutorial = require('../models/tutorial');
const user = require('../models/user');
const reset = require('../models/reset');
const { sendEmail, getOtp } = require('../helpers/helper');
const { joiSchema, joiuserSchema, joiloginSchema, forgotSchema, resetSchema } = require('../validators/validate');
const logger = require('../loggers/logger');

// Tutorial api's
// Get all tutorials

const getTutorial = async (req, res) => {
  try {
    const tutorialDb = await tutorial.find();
    if (tutorialDb) {
      res.json({ tutorialDb });
    }
  } catch (error) {
    res.status(302).json(error.message);
  }
};

// Sorted tutorial in descending order

const getSortedTutorial = async (req, res) => {
  try {
    const sort = { updatedAt: -1 };
    const tutorialDb = await tutorial.find().sort(sort);
    if (tutorialDb) {
      res.json({
        tutorialDb,
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

// Create a tutorial

const postTutorial = async (req, res) => {
  try {
    const resultValidated = await joiSchema.validateAsync(req.body);
    const tutorialDb = await tutorial(resultValidated);
    tutorialDb.save();
    if (tutorialDb) {
      res.status(200).json({
        tutorialDb,
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

// Update a tutorial

const putTutorial = async (req, res) => {
  try {
    const id = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    if (id == null) {
      throw new Error('check your id');
    } else {
      const resultBody = await joiSchema.validateAsync(req.body);
      const tutorialDb = await tutorial.findOneAndUpdate({ _id: id }, resultBody);

      if (!tutorialDb) {
        throw new Error('Tutorial not found');
      } else {
        res.json({
          tutorialDb,
        });
      }
    }
  } catch (error) {
    logger.error(error);
  }
};

// Delete a tutorial
const deleteTutorial = async (req, res) => {
  try {
    const id = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    if (id == null) {
      throw new Error('check your id');
    }
    const tutorialDb = await tutorial.findByIdAndRemove(id);
    logger.info(tutorialDb);
    if (!tutorialDb) {
      res.send('Tutorial Not Found');
    } else {
      res.json({
        tutorialDb,
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

// Find tutorial by title

const findTutorial = async (req, res) => {
  try {
    const { title } = req.params;
    let { sorting } = req.query;
    if (sorting === 'asc') {
      sorting = 1;
    } else {
      sorting = -1;
    }
    let { at } = req.query;
    if (at === 'createdAt') {
      at = { createdAt: sorting };
    } else {
      at = { updatedAt: sorting };
    }
    const tutorialDb = await tutorial.find({ title }).sort(at);
    if (!tutorialDb.length) {
      res.send('Tutorial Not Found');
    } else {
      res.json({
        tutorialDb,
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

// Users api's
// Get all users

const getUsers = async (req, res) => {
  try {
    const userDb = await user.find();
    if (userDb) {
      res.json({ userDb });
    }
  } catch (error) {
    res.status(302).json(error.message);
  }
};

// Delete the user

const deleteUsers = async (req, res) => {
  try {
    const id = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    if (id == null) {
      throw new Error('check your id');
    }
    const userDb = await user.findByIdAndRemove(id);
    if (!userDb) {
      res.send('User Not Found');
    } else {
      res.json({
        userDb,
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

// Register the user

const registerUsers = async (req, res) => {
  try {
    const resultValidated = await joiuserSchema.validateAsync(req.body);
    const userDb = await user({
      firstname: resultValidated.firstname,
      lastname: resultValidated.lastname,
      email: resultValidated.email,
      password: resultValidated.password,
    });
    userDb.save();
    if (userDb) {
      return res.status(200).json({
        userDb,
      });
    }
  } catch (error) {
    return res.json(error.message);
  }
};

// Login the user

const loginUsers = async (req, res) => {
  try {
    const resultValidated = await joiloginSchema.validateAsync(req.body);
    // check if email does not exists
    const userEp = await user.findOne({ email: resultValidated.email }).select('+password');
    if (!userEp) {
      return res.status(400).send('Email does not exists! Register or check email');
    }

    // create and assign a token
    const token = jwt.sign({ _id: userEp._id }, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.header('auth-token', token).send(token);
  } catch (error) {
    return res.json(error.message);
  }
};

// Forgot password

const forgotPassword = async (req, res) => {
  try {
    const resultValidated = await forgotSchema.validateAsync(req.body);
    // check if email does not exists
    const userE = await user.findOne({ email: resultValidated.email });
    if (!userE) {
      return res.status(400).send('Email does not exists! Register or check email');
    }
    // calling getOtp function to generate otp
    const otp = getOtp();

    // calling sendEmail function to send otp on mail
    const info = await sendEmail(userE.email, otp);
    if (info && otp) {
      const resetDb = await reset({
        email: userE.email,
        otp,
      });
      resetDb.save();
    }
    return res.status(200).send('Check the gmail for otp');
  } catch (error) {
    return res.json(error.message);
  }
};

// Reset Password

const resetPassword = async (req, res) => {
  try {
    const resultValidated = await resetSchema.validateAsync(req.body);
    const resetDb = await reset.findOne({ email: resultValidated.email, otp: resultValidated.otp });
    if (!resetDb) {
      return res.status(400).send('Please generate a otp or check the mail');
    }

    // update the password
    const userUpdated = await user.findOneAndUpdate(
      { email: resultValidated.email },
      { password: resultValidated.password }
    );
    if (!userUpdated) {
      throw new Error('User Not Found');
    } else {
      return res.status(200).json('Password updated successfully');
    }
  } catch (error) {
    return res.send(error.message);
  }
};

// Tutorial and user exports

module.exports = {
  getTutorial,
  getSortedTutorial,
  postTutorial,
  putTutorial,
  deleteTutorial,
  findTutorial,
  registerUsers,
  getUsers,
  deleteUsers,
  loginUsers,
  forgotPassword,
  resetPassword,
};

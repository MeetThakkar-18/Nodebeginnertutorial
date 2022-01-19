const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const tutorial = require('../models/tutorial');
const user = require('../models/user');
const reset = require('../models/reset');
const { joiSchema, joiuserSchema, joiloginSchema, forgotSchema, resetSchema } = require('../validators/validate');
const logger = require('../loggers/logger');

// function for sending mail using node mailer

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.AUTH_EMAIL, // sender address
      to: email, // list of receivers
      subject: 'Forgot Password', // Subject line
      text: `Your one time password`, // plain text body
      html: `<p><b>your one time password is : ${otp} </b> Enter this otp in the swagger reset password section and also enter your new password and click submit then your password will be successfully reseted<p>This otp will get expire in 2 mins</p></p>`, // html body
    });
    return info.messageId;
  } catch (error) {
    return error.message;
  }
};

// generating alphanumeric otp

const getOtp = function () {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

// Tutorial api's
// Get all tutorials

const getTutorial = async (req, res) => {
  try {
    const tutorialdb = await tutorial.find();
    if (tutorialdb) {
      res.json({ tutorialdb });
    }
  } catch (error) {
    res.status(302).json(error.message);
  }
};

// Sorted tutorial in descending order

const getSortedTutorial = async (req, res) => {
  try {
    const sort = { updatedAt: -1 };
    const tutorialdb = await tutorial.find().sort(sort);
    if (tutorialdb) {
      res.json({
        tutorialdb,
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
    const tutorialdb = await tutorial(resultValidated);
    tutorialdb.save();
    if (tutorialdb) {
      res.status(200).json({
        tutorialdb,
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
      const tutorialdb = await tutorial.findOneAndUpdate({ _id: id }, resultBody);

      if (!tutorialdb) {
        throw new Error('Tutorial not found');
      } else {
        res.json({
          tutorialdb,
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
    const tutorialdb = await tutorial.findByIdAndRemove(id);
    logger.info(tutorialdb);
    if (!tutorialdb) {
      res.send('Tutorial Not Found');
    } else {
      res.json({
        tutorialdb,
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
    const tutorialdb = await tutorial.find({ title }).sort(at);
    if (!tutorialdb.length) {
      res.send('Tutorial Not Found');
    } else {
      res.json({
        tutorialdb,
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
    const userdb = await user.find();
    if (userdb) {
      res.json({ userdb });
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
    const userdb = await user.findByIdAndRemove(id);
    if (!userdb) {
      res.send('User Not Found');
    } else {
      res.json({
        userdb,
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
    // check if user is already registered
    const emailExist = await user.findOne({ email: resultValidated.email });
    if (emailExist) {
      return res.status(400).send('Email already exists');
    }
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(resultValidated.password, salt);
    const userdb = await user({
      firstname: resultValidated.firstname,
      lastname: resultValidated.lastname,
      email: resultValidated.email,
      password: hashedPassword,
    });
    userdb.save();
    if (userdb) {
      return res.status(200).json({
        userdb,
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
    const userEP = await user.findOne({ email: resultValidated.email }).select('+password');
    if (!userEP) {
      return res.status(400).send('Email does not exists! Register or check email');
    }

    // if password is incorrect
    const checkPass = await bcrypt.compare(resultValidated.password, userEP.password);
    if (!checkPass) {
      return res.status(400).send('Password is incorrect');
    }
    // create and assign a token
    const token = jwt.sign({ _id: userEP._id }, process.env.TOKEN_SECRET, { expiresIn: '12h' });
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
      const resetdb = await reset({
        email: userE.email,
        otp,
      });
      resetdb.save();
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
    const resetdb = await reset.findOne({ email: resultValidated.email, otp: resultValidated.otp });
    if (!resetdb) {
      return res.status(400).send('Please generate a otp or check the mail');
    }
    // check the old password with the new password
    const userdb = await user.findOne({ email: resultValidated.email });
    const passwordcheck = await bcrypt.compare(resultValidated.newpassword, userdb.password);
    if (passwordcheck) {
      throw new Error('Password should not be the same as old password');
    }

    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(resultValidated.newpassword, salt);

    // update the password
    const userupdated = await user.findOneAndUpdate({ email: resultValidated.email }, { password: hashedPassword });
    if (!userupdated) {
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

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tutorial = require('../models/tutorial');
const user = require('../models/user');
const { joiSchema, joiuserSchema, joiloginSchema } = require('../validators/validate');
const logger = require('../loggers/logger');
// Tutorial api's

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

const loginUsers = async (req, res) => {
  try {
    const resultValidated = await joiloginSchema.validateAsync(req.body);
    // check if email does not exists
    const userEP = await user.findOne({ email: resultValidated.email });
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
};

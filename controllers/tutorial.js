const tutorial = require('../models/tutorial');
const { joiSchema } = require('../validators/validate');
const logger = require('../loggers/logger');

const getTutorial = async (req, res) => {
  try {
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
    const tutorialdb = await tutorial.find().sort(at);
    if (tutorialdb) {
      res.json({ tutorialdb });
    }
  } catch (error) {
    logger.error(error);
    res.send(logger.error(error));
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
    const resultvalidated = await joiSchema.validateAsync(req.body);
    const tutorialdb = await tutorial(resultvalidated);
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

module.exports = {
  getTutorial,
  getSortedTutorial,
  postTutorial,
  putTutorial,
  deleteTutorial,
  findTutorial,
};

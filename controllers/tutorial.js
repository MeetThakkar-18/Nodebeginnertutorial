const express = require('express');
const TutorialRoutes = require('../routes/tutorial');
const Tutorial = require('../models/tutorial');
const { joiSchema } = require('../validators/validate');

exports.getTutorial = (req, res) => {
  try {
    const tutorial = Tutorial.find().then((tutorial) => {
      res.json({ tutorial });
    });
  } catch (error) {
    res.status(302).json(error.message);
  }
};

exports.postTutorial = async (req, res) => {
  try {
    const resultvalidated = await joiSchema.validateAsync(req.body);
    const tutorial = new Tutorial(resultvalidated);
    tutorial.save().then((result) => {
      res.status(200).json({
        tutorial: result,
      });
    });
  } catch (error) {
    res.status(302).json(error.message);
  }
};

exports.putTutorial = async (req, res) => {
  try {
    const id = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    if (id == null) {
      throw new Error('!! Please Enter correct Objectid');
    }
    const putvalidate = await joiSchema.validateAsync(req.body);
    const tutorial = await Tutorial.findByIdAndUpdate(
      id,
      {
        title: putvalidate.title,
        description: putvalidate.description,
        published: putvalidate.published,
      },
      { new: true }
    ).then((result) => {
      if (!result) {
        res.send('Tutorial Not Found');
      } else {
        res.json({
          result,
        });
      }
    });
  } catch (error) {
    res.status(302).json(error.message);
  }
};

exports.deleteTutorial = async (req, res) => {
  try {
    const id = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    if (id == null) {
      throw new Error('!! Please Enter correct Objectid');
    }
    const tutorial = await Tutorial.findByIdAndRemove(id).then((result) => {
      if (!result) {
        res.send('Tutorial Not Found');
      } else {
        res.status(200).json({
          result,
        });
      }
    });
  } catch (error) {
    res.status(302).json(error.message);
  }
};

exports.findTutorial = async (req, res) => {
  try {
    // console.log(req.params.title);
    const { title } = req.params;
    let { sorting } = req.query;
    if (sorting === 'asc') {
      sorting = 1;
    } else {
      sorting = -1;
    }
    let field = req.query.at;
    if (field === 'createdAt') {
      field = { createdAt: sorting };
    } else {
      field = { updatedAt: sorting };
    }
    const tutorial = await Tutorial.find({ title })
      .sort(field)
      .then((tutorial) => {
        if (tutorial == null || tutorial === '') {
          res.send('Tutorial Not Found');
        } else {
          res.json({
            tutorial,
          });
        }
      });
  } catch (error) {
    res.status(302).json(error.message);
  }
};

exports.getsortTutorial = (req, res) => {
  try {
    const mysort = { updatedAt: -1 };
    const tutorial = Tutorial.find()
      .sort(mysort)
      .then((tutorial) => {
        if (tutorial == null || tutorial === '') {
          res.send('Tutorial Not Found');
        } else {
          res.json({
            tutorial,
          });
        }
      });
  } catch (error) {
    res.status(302).json(error.message);
  }
};
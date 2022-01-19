const joi = require('joi');

// validation schema for tutorials
const joiSchema = joi
  .object()
  .keys({
    title: joi.string().trim().min(3).max(100).required(),
    description: joi.string().trim().min(1).max(5000).required(),
    published: joi.boolean(),
  })
  .or('title', 'description', 'published');

// validation schema for user register

const joiuserSchema = joi.object().keys({
  firstname: joi
    .string()
    .pattern(/^[a-zA-Z]{3,100}$/)
    .trim()
    .required(),
  lastname: joi
    .string()
    .pattern(/^[a-zA-Z]{3,100}$/)
    .trim()
    .required(),
  email: joi
    .string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .email()
    .trim()
    .required(),
  password: joi
    .string()
    .pattern(/^[a-zA-Z0-9]{6,1024}$/)
    .trim()
    .required(),
});

// validation schema for user login

const joiloginSchema = joi.object().keys({
  email: joi
    .string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .email()
    .trim()
    .required(),
  password: joi
    .string()
    .pattern(/^[a-zA-Z0-9]{6,1024}$/)
    .trim()
    .required(),
});

// validation schema for forgot password

const forgotSchema = joi.object().keys({
  email: joi
    .string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .email()
    .trim()
    .required(),
});

// validation schema for reset password

const resetSchema = joi.object().keys({
  email: joi
    .string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .email()
    .trim()
    .required(),
  newpassword: joi
    .string()
    .pattern(/^[a-zA-Z0-9]{6,1024}$/)
    .trim()
    .required(),
  otp: joi.string().trim().min(6).max(6).alphanum().required(),
});

// exports of joi schemas
module.exports = { joiSchema, joiuserSchema, joiloginSchema, forgotSchema, resetSchema };

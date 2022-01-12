const joi = require('joi');

const joiSchema = joi
  .object()
  .keys({
    title: joi.string().trim().min(3).max(100).required(),
    description: joi.string().trim().min(1).max(5000).required(),
    published: joi.boolean(),
  })
  .or('title', 'description', 'published');

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

module.exports = { joiSchema, joiuserSchema, joiloginSchema };

//  ---------------------express validator-----------------------------------------------
// exports.createTutorialValidator = (req,res,next) => {
//     req.check('title','Write a title , Title is must required').notEmpty()
//     req.check('title','Title must be between 3 to 100 character').isLength({
//        min:3,
//        max:100
//     });

//     req.check('description','Write a description , it is required').notEmpty()
//     req.check('description','Description must be between 1 to 5000 character').isLength({
//        min:1,
//        max:5000
//     });

//     const errors = req.validationErrors()
//     if(errors){
//         const firstError = errors.map((error) => error.msg)[0]
//         return res.status(400).json({error: firstError})
//     }
//     next();
// };

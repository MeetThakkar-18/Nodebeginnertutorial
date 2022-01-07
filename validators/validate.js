const joi = require('joi');

const joiSchema = joi.object().keys({
  title: joi.string().trim().min(3).max(100).required(),
  description: joi.string().trim().min(1).max(5000).required(),
  published: joi.boolean(),
});
module.exports = { joiSchema };

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

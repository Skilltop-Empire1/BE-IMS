const Joi = require("joi");

const userValidation = Joi.object({
  userName: Joi.string().alphanum().min(6).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});



const validateLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

const resetLink = Joi.object({
  email: Joi.string().email().required(),
})

const validatePasswordReset = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().required(),
})

//*****export module */
module.exports = {
  userValidation,
  validateLogin,
  validatePasswordReset,
  resetLink

};

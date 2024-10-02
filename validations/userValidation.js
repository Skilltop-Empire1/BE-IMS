const Joi = require("joi");

const userValidation = Joi.object({
  userName: Joi.string().alphanum().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});



const validateLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const resetLink = Joi.object({
  email: Joi.string().email().required(),
})

const validatePasswordReset = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
})

const changePassword = Joi.object({
  email: Joi.string().email().required(),
  oldPassword:Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
})


//*****export module */
module.exports = {
  userValidation,
  validateLogin,
  validatePasswordReset,
  changePassword,
  resetLink

};

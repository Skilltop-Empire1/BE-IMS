const Joi = require("joi");

const userValidation = Joi.object({
  userName: Joi.string().alphanum().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  code: Joi.string().required()
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

const planValidation = Joi.object({
  email: Joi.string().email().required(),
  phone:Joi.string().required().min(11),
  businessName: Joi.string().required(),
  subscribedPlan: Joi.string().required(),
})


const demoValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone:Joi.string().required().min(11),
  // state: Joi.string().required(),
  company: Joi.string().required(),
  // title: Joi.string().required(),
})

//*****export module */
module.exports = {
  userValidation,
  validateLogin,
  validatePasswordReset,
  changePassword,
  resetLink,
  planValidation,
  demoValidation 


};

const Joi = require("joi");

const userValidation = Joi.object({
  userName: Joi.string().alphanum().min(3).max(30).required(),

  email: Joi.string().email().required(),

  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
});

//*****export module */
module.exports = userValidation;
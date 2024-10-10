const Joi = require('joi');

const createCategorySchema = Joi.object({
  storeId: Joi.string().required().messages({
    'number.base': 'Store ID must be a number',
    'any.required': 'Store ID is required'
  }),
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required'
  })
});

const updateCategorySchema = Joi.object({
  storeId: Joi.string().optional().messages({
    'number.base': 'Store ID must be a number'
  }),
  name: Joi.string().optional().messages({
    'string.base': 'Name must be a string'
  })
});

module.exports = {
  createCategorySchema,
  updateCategorySchema
};

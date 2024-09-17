const Joi = require('joi');

const storeSchema = Joi.object({
    userId: Joi.number().required().messages({
        'any.required': 'User ID is required to create a store.',
        'number.base': 'User ID must be a number.'
    }),
    storeName: Joi.string().required().messages({
        'any.required': 'Store Name is required.',
        'string.base': 'Store Name must be a string.'
    }),
    location: Joi.string().required().messages({
        'any.required': 'Location is required.',
        'string.base': 'Location must be a string.'
    }),
    storeContact: Joi.string().required().messages({
        'any.required': 'Store Contact is required.',
        'string.base': 'Store Contact must be a valid string.'
    }),
    description: Joi.string().optional(),
    noOfStaff: Joi.number().optional(),
    storeManager: Joi.string().optional()
});

module.exports = { storeSchema };

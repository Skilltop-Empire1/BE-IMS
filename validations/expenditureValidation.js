const Joi = require('joi');

const expenditureValidationSchema = Joi.object({
  expendId: Joi.string().guid({ version: 'uuidv4' }).optional(), // Optional as it is auto-generated
  type: Joi.string().valid('OPEX', 'CAPEX').required(),
  category: Joi.string().required(),
  paymentMethod: Joi.string().optional().allow(''), // Only for OPEX, can be empty
  description: Joi.string().required(),
  annualDepreciation: Joi.number().precision(2).optional().allow(''), // Only for CAPEX
  vendor: Joi.string().optional().allow(''),
  amount: Joi.number().positive().required(),
  notes: Joi.string().optional().allow(''),
  dateOfExpense: Joi.date().required(),
  //uploadReceipt: Joi.string().uri().optional().allow(''), // Assuming the receipt is a URL
  expectedLifespan: Joi.number().integer().optional().allow(''), // Only for CAPEX
});

module.exports = expenditureValidationSchema;

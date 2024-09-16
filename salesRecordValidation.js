const Joi = require("joi");

const salesRecordValidationSchema = Joi.object({
  saleId: Joi.number().integer().optional(), 
  userId: Joi.number().integer().required(), 
  productId: Joi.number().integer().required(), 
  paymentMethod: Joi.string().valid("cash", "POS", "transfer").required(), 
  quantity: Joi.number().integer().positive().required(), 
  categoryId: Joi.number().integer().required(), 
  storeId: Joi.number().integer().required(), 
  soldDate: Joi.date().iso().required(),
});

module.exports = {
  salesRecordValidationSchema,
};

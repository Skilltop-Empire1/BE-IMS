const Joi = require('joi');

// Create Product validation
exports.createProductSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  itemCode: Joi.string().required(),
  //prodPhoto: Joi.string().required(),
  alertStatus: Joi.number().required(),
  quantity: Joi.number().required(),
  categoryId: Joi.string().required(),
  storeId: Joi.string().required(),
  storeAvailable: Joi.string().required(),
  prodDate: Joi.date().optional(),
});

// Update Product validation
exports.updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  price: Joi.number().optional(),
  itemCode: Joi.string().optional(),
  //prodPhoto: Joi.string().optional(),
  alertStatus: Joi.number().optional(),
  quantity: Joi.number().optional(),
  categoryId: Joi.string().optional(),
  storeId: Joi.string().optional(),
  storeAvailable: Joi.string().optional(),
  prodDate: Joi.date().optional(),
});

// Update Product Stock validation
exports.updateStockSchema = Joi.object({
  quantity: Joi.number().required()
});

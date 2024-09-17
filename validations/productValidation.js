const Joi = require('joi');

// Create Product validation
exports.createProductSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  itemCode: Joi.string().required(),
  //prodPhoto: Joi.string().required(),
  alertStatus: Joi.string().valid('active', 'low', 'sold out').required(),
  quantity: Joi.number().required(),
  categoryId: Joi.number().required(),
  storeId: Joi.number().required(),
  storeAvailable: Joi.string().valid('storeA', 'storeB', 'storeC').required(),
  prodDate: Joi.date().optional(),
});

// Update Product validation
exports.updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  price: Joi.number().optional(),
  itemCode: Joi.string().optional(),
  //prodPhoto: Joi.string().optional(),
  alertStatus: Joi.string().valid('active', 'low', 'sold out').optional(),
  quantity: Joi.number().optional(),
  categoryId: Joi.number().optional(),
  storeId: Joi.number().optional(),
  storeAvailable: Joi.string().optional(),
  prodDate: Joi.date().optional(),
});

// Update Product Stock validation
exports.updateStockSchema = Joi.object({
  quantity: Joi.number().required()
});

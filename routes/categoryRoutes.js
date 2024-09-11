const express = require("express");
const router = express.Router();
const categoryController = require('../controllers/categoryController');


// Create a new category
router.post('/', categoryController.createCategory);
// Get all categories
router.get('/', categoryController.getAllCategories);
// Get a category by ID
router.get('/:catId', categoryController.getCategoryById);
// Update a category
router.put('/:catId', categoryController.updateCategory);
// Delete a category
router.delete('/:catId', categoryController.deleteCategory);
// Get categories by store
router.get('/store/:storeId', categoryController.getCategoriesByStore);
// Get products in a category
router.get('/:catId/products', categoryController.getProductsByCategory);

module.exports = router;

module.exports = router;
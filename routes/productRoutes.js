const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require("../middlewares/multer")


// Create a new product
router.post('/',upload.single("image"), productController.createProduct);
// Get all products
router.get('/', productController.getAllProducts);
// Filter products by availability
router.get('/availability', productController.getProductsByAvailability);
router.get('/filter',productController.filterAllProducts)
// Get a product by ID
router.get('/:prodId', productController.getProductById);
// Update a product
router.put('/:prodId', productController.updateProduct);
// Delete a product
router.delete('/:prodId', productController.deleteProduct);
// Get products by category
router.get('/category/:categoryId', productController.getProductsByCategory);
// Get products by store
router.get('/store/:storeId', productController.getProductsByStore);
// Update product stock
router.patch('/:prodId/stock', productController.updateProductStock);



module.exports = router;

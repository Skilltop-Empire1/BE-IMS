const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require("../middlewares/multer")
const loginJWTAthentication = require("../middlewares/authMiddleware");
const authorize = require('../middlewares/rolePermission');



/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *               price:
 *                 type: number
 *                 description: Price of the product
 *               stock:
 *                 type: integer
 *                 description: Available stock for the product
 *               categoryId:
 *                 type: string
 *                 description: ID of the category the product belongs to
 *               storeId:
 *                 type: string
 *                 description: ID of the store the product belongs to
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image of the product
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', upload.single("prodPhoto"), loginJWTAthentication,authorize("Products", "create"),productController.createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: integer
 *                   categoryId:
 *                     type: string
 *                   storeId:
 *                     type: string
 */
router.get('/',loginJWTAthentication,authorize("Products", "view"), productController.getAllProducts);

/**
 * @swagger
 * /products/availability:
 *   get:
 *     summary: Filter products by availability
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of available products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: integer
 */
router.get('/availability', loginJWTAthentication,authorize("Products", "view"),productController.getProductsByAvailability);

/**
 * @swagger
 * /products/filter:
 *   get:
 *     summary: Filter products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by product name
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: Filter by product price
 *     responses:
 *       200:
 *         description: Filtered list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: integer
 */
router.get('/filter', loginJWTAthentication,authorize("Products", "view"),productController.filterAllProducts);

/**
 * @swagger
 * /products/{prodId}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: prodId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *                 stock:
 *                   type: integer
 *                 categoryId:
 *                   type: string
 *                 storeId:
 *                   type: string
 *       404:
 *         description: Product not found
 */
router.get('/:prodId', loginJWTAthentication,authorize("Products", "view"),productController.getProductById);

/**
 * @swagger
 * /products/{prodId}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: prodId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *               storeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 */
router.put('/:prodId',upload.single("prodPhoto"),loginJWTAthentication,authorize("Products", "edit"),productController.updateProduct);

/**
 * @swagger
 * /products/{prodId}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: prodId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:prodId',loginJWTAthentication,authorize("Products", "approval"), productController.deleteProduct);

/**
 * @swagger
 * /products/category/{categoryId}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to retrieve products from
 *     responses:
 *       200:
 *         description: List of products in the category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: integer
 *                   categoryId:
 *                     type: string
 */
router.get('/category/:categoryId',loginJWTAthentication,authorize("Products", "view"), productController.getProductsByCategory);

/**
 * @swagger
 * /products/store/{storeId}:
 *   get:
 *     summary: Get products by store
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the store to retrieve products from
 *     responses:
 *       200:
 *         description: List of products in the store
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: integer
 *                   storeId:
 *                     type: string
 */
router.get('/store/:storeId',loginJWTAthentication,authorize("Products", "view"), productController.getProductsByStore);

/**
 * @swagger
 * /products/{prodId}/stock:
 *   patch:
 *     summary: Update product stock
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: prodId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update stock
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: integer
 *                 description: The updated stock amount
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 */
router.patch('/:prodId/stock',loginJWTAthentication, authorize("Products", "edit"),productController.updateProductStock);



module.exports = router;

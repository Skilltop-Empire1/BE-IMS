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
router.post('/upload', upload.single('image'), productController.skillTopImage);
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
 *                 categoryName:
 *                   type: string
 *                 storeName:
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

/**
 * @swagger
 * /products/transferProd:
 *   post:
 *     summary: Transfer a product between stores and categories
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product being transferred
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product to be transferred
 *               currentStore:
 *                 type: string
 *                 description: The name of the current store
 *               reasonForTransfer:
 *                 type: string
 *                 description: The reason for transferring the product
 *               currentCategory:
 *                 type: string
 *                 description: The category of the product in the current store
 *               destinationStore:
 *                 type: string
 *                 description: The name of the destination store
 *               destinationCategory:
 *                 type: string
 *                 description: The category of the product in the destination store
 *             required:
 *               - name
 *               - quantity
 *               - currentStore
 *               - currentCategory
 *               - destinationStore
 *               - destinationCategory
 *             example:
 *               name: "Laptop"
 *               quantity: 5
 *               currentStore: "Main Warehouse"
 *               reasonForTransfer: "Stock redistribution"
 *               currentCategory: "Electronics"
 *               destinationStore: "Downtown Branch"
 *               destinationCategory: "Computers"
 *     responses:
 *       200:
 *         description: Product transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product transfer successful."
 *                 transferDetails:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "user123"
 *                     productPhoto:
 *                       type: string
 *                       example: "image_url"
 *                     productName:
 *                       type: string
 *                       example: "Laptop"
 *                     currentStore:
 *                       type: string
 *                       example: "Main Warehouse"
 *                     currentCategory:
 *                       type: string
 *                       example: "Electronics"
 *                     destinationStore:
 *                       type: string
 *                       example: "Downtown Branch"
 *                     destinationCategory:
 *                       type: string
 *                       example: "Computers"
 *                     quantityTransferred:
 *                       type: integer
 *                       example: 5
 *                     dateTransferred:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-19T15:30:00Z"
 *       400:
 *         description: Invalid input or insufficient product quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Insufficient quantity for transfer."
 *       403:
 *         description: Forbidden – User is not authorized to perform the transfer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You do not have permission to transfer products between these stores."
 *       404:
 *         description: Not Found – One of the stores, categories, or product records could not be found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Current store not found for this user."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred during product transfer."
 *                 error:
 *                   type: string
 *                   description: Detailed error information
 *               example:
 *                 message: "An error occurred during product transfer."
 *                 error: "Database connection failed."
 */

router.post('/transferProd',loginJWTAthentication,authorize("Products","edit"),productController.transferProduct);

/**
 * @swagger
 * /products/transferLog:
 *   patch:
 *     summary: Retrieve the transfer log for the authenticated user
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the transfer log
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transfers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         description: ID of the user who performed the transfer
 *                         example: "user123"
 *                       productPhoto:
 *                         type: string
 *                         description: URL of the transferred product's photo
 *                         example: "http://example.com/photo.jpg"
 *                       productName:
 *                         type: string
 *                         description: Name of the transferred product
 *                         example: "Laptop"
 *                       currentStore:
 *                         type: string
 *                         description: Name of the store the product was transferred from
 *                         example: "Main Warehouse"
 *                       currentCategory:
 *                         type: string
 *                         description: Name of the category the product was in before transfer
 *                         example: "Electronics"
 *                       destinationStore:
 *                         type: string
 *                         description: Name of the store the product was transferred to
 *                         example: "Downtown Branch"
 *                       destinationCategory:
 *                         type: string
 *                         description: Name of the category the product was transferred to
 *                         example: "Computers"
 *                       quantityTransferred:
 *                         type: integer
 *                         description: Quantity of the product transferred
 *                         example: 5
 *                       dateTransferred:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time the transfer occurred
 *                         example: "2024-11-19T15:30:00Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching transfer logs."
 */

router.patch('/transferLog' ,loginJWTAthentication ,authorize("Products","edit","create","view"),productController.getTransferLog);

module.exports = router;

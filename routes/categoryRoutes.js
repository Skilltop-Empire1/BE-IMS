const express = require("express");
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const loginJWTAthentication = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/rolePermission");


// // Create a new category
// router.post('/', categoryController.createCategory);
// // Get all categories
// router.get('/', categoryController.getAllCategories);
// // Get a category by ID
// router.get('/:catId', categoryController.getCategoryById);
// // Update a category
// router.put('/:catId', categoryController.updateCategory);
// // Delete a category
// router.delete('/:catId', categoryController.deleteCategory);
// // Get categories by store
// router.get('/store/:storeId', categoryController.getCategoriesByStore);
// // Get products in a category
// router.get('/:catId/products', categoryController.getProductsByCategory);


/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management API
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category
 *               storeId:
 *                 type: string
 *                 description: ID of the store the category belongs to
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/',loginJWTAthentication,categoryController.createCategory);
/**
 * @swagger
 * /filter:
 *   get:
 *     summary: Retrieve all categories with filters
 *     description: This endpoint allows you to retrieve all categories based on specific filters.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: query
 *         name: storeId
 *         schema:
 *           type: integer
 *         description: Optional store ID to filter categories by store
 *       - in: query
 *         name: categoryName
 *         schema:
 *           type: string
 *         description: Optional category name to filter by name
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   categoryId:
 *                     type: integer
 *                     description: The category ID
 *                   categoryName:
 *                     type: string
 *                     description: The name of the category
 *                   storeId:
 *                     type: integer
 *                     description: The ID of the store the category belongs to
 *       404:
 *         description: No categories found
 *       500:
 *         description: Server error
 */

router.get("/filter",loginJWTAthentication,categoryController.filterAllCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
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
 *                   storeId:
 *                     type: string
 */
router.get('/',loginJWTAthentication,categoryController.getAllCategories);

/**
 * @swagger
 * /categories/{catId}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: catId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 storeId:
 *                   type: string
 *       404:
 *         description: Category not found
 */
router.get('/:catId', loginJWTAthentication,categoryController.getCategoryById);

/**
 * @swagger
 * /categories/{catId}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: catId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the category
 *               storeId:
 *                 type: string
 *                 description: Updated ID of the store
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Category not found
 */
router.put('/:catId',loginJWTAthentication, categoryController.updateCategory);

/**
 * @swagger
 * /categories/{catId}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: catId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete('/:catId',loginJWTAthentication, categoryController.deleteCategory);

/**
 * @swagger
 * /categories/store/{storeId}:
 *   get:
 *     summary: Get categories by store
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the store to retrieve categories from
 *     responses:
 *       200:
 *         description: List of categories in the store
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
 *                   storeId:
 *                     type: string
 */
router.get('/store/:storeId', loginJWTAthentication,categoryController.getCategoriesByStore);

/**
 * @swagger
 * /categories/{catId}/products:
 *   get:
 *     summary: Get products in a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: catId
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
 *                   categoryId:
 *                     type: string
 *       404:
 *         description: Category not found
 */
router.get('/:catId/products',loginJWTAthentication, categoryController.getProductsByCategory);




module.exports = router;


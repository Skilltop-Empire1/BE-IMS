/**
 * @swagger
 * components:
 *   schemas:
 *     Expenditure:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: Type of expenditure (OPEX or CAPEX)
 *           example: "OPEX"
 *         category:
 *           type: string
 *           description: Category of expenditure
 *           example: "Utilities"
 *         paymentMethod:
 *           type: string
 *           description: Payment method used for OPEX
 *           example: "Credit Card"
 *         description:
 *           type: string
 *           description: Description of the expenditure
 *           example: "Monthly electricity bill"
 *         annualDepreciation:
 *           type: number
 *           description: Annual depreciation value for CAPEX
 *           example: 1000.00
 *         vendor:
 *           type: string
 *           description: Vendor associated with the expenditure
 *           example: "Electricity Company"
 *         amount:
 *           type: number
 *           description: Amount of the expenditure
 *           example: 150.50
 *         notes:
 *           type: string
 *           description: Additional notes about the expenditure
 *           example: "Payment made in full"
 *         dateOfExpense:
 *           type: string
 *           format: date
 *           description: Date of the expense
 *           example: "2024-11-13"
 *         uploadReceipt:
 *           type: string
 *           format: binary
 *           description: Upload receipt file
 *         expectedLifespan:
 *           type: number
 *           description: Expected lifespan for CAPEX items
 *           example: 5
 */

/**
 * @swagger
 * /api/expenditures/create:
 *   post:
 *     summary: Create a new expenditure
 *     tags: [Expenditures]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "CAPEX"
 *               category:
 *                 type: string
 *                 example: "Office Equipment"
 *               paymentMethod:
 *                 type: string
 *                 example: "Bank Transfer"
 *               description:
 *                 type: string
 *                 example: "Purchase of new computers"
 *               annualDepreciation:
 *                 type: number
 *                 example: 500.00
 *               vendor:
 *                 type: string
 *                 example: "Tech Supplies Inc."
 *               amount:
 *                 type: number
 *                 example: 2500.00
 *               notes:
 *                 type: string
 *                 example: "Includes 5-year warranty"
 *               dateOfExpense:
 *                 type: string
 *                 format: date
 *                 example: "2024-11-13"
 *               receipt:
 *                 type: string
 *                 format: binary
 *               expectedLifespan:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Expenditure created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "123e4567-e89b-12d3-a456-426614174000"
 *               type: "CAPEX"
 *               category: "Office Equipment"
 *               paymentMethod: "Bank Transfer"
 *               description: "Purchase of new computers"
 *               annualDepreciation: 500.00
 *               vendor: "Tech Supplies Inc."
 *               amount: 2500.00
 *               notes: "Includes 5-year warranty"
 *               dateOfExpense: "2024-11-13"
 *               uploadReceipt: "https://example.com/receipt.jpg"
 *               expectedLifespan: 10
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/expenditures/list:
 *   get:
 *     summary: Get all expenditures
 *     tags: [Expenditures]
 *     responses:
 *       200:
 *         description: List of expenditures
 *         content:
 *           application/json:
 *             example:
 *               - id: "123e4567-e89b-12d3-a456-426614174001"
 *                 type: "OPEX"
 *                 category: "Rent"
 *                 paymentMethod: "Direct Debit"
 *                 description: "Monthly office rent"
 *                 amount: 1200.00
 *                 dateOfExpense: "2024-11-01"
 *               - id: "123e4567-e89b-12d3-a456-426614174002"
 *                 type: "CAPEX"
 *                 category: "Office Furniture"
 *                 amount: 3000.00
 *                 dateOfExpense: "2024-10-15"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/expenditures/{id}:
 *   get:
 *     summary: Get an expenditure by ID
 *     tags: [Expenditures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Expenditure ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expenditure details
 *         content:
 *           application/json:
 *             example:
 *               id: "123e4567-e89b-12d3-a456-426614174000"
 *               type: "CAPEX"
 *               category: "Office Equipment"
 *               paymentMethod: "Bank Transfer"
 *               description: "Purchase of new computers"
 *               annualDepreciation: 500.00
 *               vendor: "Tech Supplies Inc."
 *               amount: 2500.00
 *               notes: "Includes 5-year warranty"
 *               dateOfExpense: "2024-11-13"
 *               uploadReceipt: "https://example.com/receipt.jpg"
 *               expectedLifespan: 10
 *       404:
 *         description: Expenditure not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/expenditures/{id}:
 *   put:
 *     summary: Update an expenditure by ID
 *     tags: [Expenditures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Expenditure ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "OPEX"
 *               category:
 *                 type: string
 *                 example: "Maintenance"
 *               paymentMethod:
 *                 type: string
 *                 example: "Cash"
 *               description:
 *                 type: string
 *                 example: "Repair services for office equipment"
 *               vendor:
 *                 type: string
 *                 example: "Repair Co."
 *               amount:
 *                 type: number
 *                 example: 300.00
 *               notes:
 *                 type: string
 *                 example: "Repair included replacement parts"
 *               dateOfExpense:
 *                 type: string
 *                 format: date
 *                 example: "2024-11-10"
 *               receipt:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Expenditure updated successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "123e4567-e89b-12d3-a456-426614174003"
 *               type: "OPEX"
 *               category: "Maintenance"
 *               paymentMethod: "Cash"
 *               description: "Repair services for office equipment"
 *               vendor: "Repair Co."
 *               amount: 300.00
 *               notes: "Repair included replacement parts"
 *               dateOfExpense: "2024-11-10"
 *               uploadReceipt: "https://example.com/new-receipt.jpg"
 *       404:
 *         description: Expenditure not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/expenditures/{id}:
 *   delete:
 *     summary: Delete an expenditure by ID
 *     tags: [Expenditures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Expenditure ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expenditure deleted successfully
 *       404:
 *         description: Expenditure not found
 *       500:
 *         description: Server error
 */

const express = require('express');
const router = express.Router();
const upload = require("../middlewares/multer")
const loginJWTAthentication = require("../middlewares/authMiddleware")

const {
  createExpenditure,
  getAllExpenditures,
  getExpenditureById,
  updateExpenditure,
  deleteExpenditure,
} = require('../controllers/expenditureController'); 

router.post('/create',upload.single("receipt"),loginJWTAthentication, createExpenditure);
router.get('/list',loginJWTAthentication, getAllExpenditures);
router.get('/:id',loginJWTAthentication, getExpenditureById);
router.put('/:id',upload.single("receipt"),loginJWTAthentication,updateExpenditure);
router.delete('/:id',loginJWTAthentication,deleteExpenditure);

module.exports = router;

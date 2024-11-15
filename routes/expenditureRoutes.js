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
 *         category:
 *           type: string
 *           description: Category of expenditure
 *         paymentMethod:
 *           type: string
 *           description: Payment method used for OPEX
 *         description:
 *           type: string
 *           description: Description of the expenditure
 *         annualDepreciation:
 *           type: number
 *           description: Annual depreciation value for CAPEX
 *         vendor:
 *           type: string
 *           description: Vendor associated with the expenditure
 *         amount:
 *           type: number
 *           description: Amount of the expenditure
 *         notes:
 *           type: string
 *           description: Additional notes about the expenditure
 *         dateOfExpense:
 *           type: string
 *           format: date
 *           description: Date of the expense
 *         uploadReceipt:
 *           type: string
 *           format: binary
 *           description: Upload receipt file
 *         expectedLifespan:
 *           type: number
 *           description: Expected lifespan for CAPEX items
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
 *               category:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               description:
 *                 type: string
 *               annualDepreciation:
 *                 type: number
 *               vendor:
 *                 type: string
 *               amount:
 *                 type: number
 *               notes:
 *                 type: string
 *               dateOfExpense:
 *                 type: string
 *                 format: date
 *               receipt:
 *                 type: string
 *                 format: binary
 *               expectedLifespan:
 *                 type: number
 *     responses:
 *       201:
 *         description: Expenditure created successfully
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
 *               category:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               description:
 *                 type: string
 *               annualDepreciation:
 *                 type: number
 *               vendor:
 *                 type: string
 *               amount:
 *                 type: number
 *               notes:
 *                 type: string
 *               dateOfExpense:
 *                 type: string
 *                 format: date
 *               receipt:
 *                 type: string
 *                 format: binary
 *               expectedLifespan:
 *                 type: number
 *     responses:
 *       200:
 *         description: Expenditure updated successfully
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

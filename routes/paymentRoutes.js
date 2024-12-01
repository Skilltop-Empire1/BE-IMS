/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentCode:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the payment code
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         code:
 *           type: string
 *           description: The payment code
 *           example: "PAY12345"
 *         status:
 *           type: string
 *           description: Status of the payment code
 *           example: "active"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date the payment code was created
 *           example: "2024-11-29T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date the payment code was last updated
 *           example: "2024-11-30T12:00:00Z"
 */

/**
 * @swagger
 * /api/payments/code/send:
 *   post:
 *     summary: Manually send a payment code
 *     tags: [Payments]
 *     responses:
 *       201:
 *         description: Payment code sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Payment code sent successfully."
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/payments/code/list:
 *   get:
 *     summary: Get all payment codes
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of all payment codes
 *         content:
 *           application/json:
 *             example:
 *               - id: "123e4567-e89b-12d3-a456-426614174001"
 *                 code: "PAY12345"
 *                 status: "active"
 *                 createdAt: "2024-11-29T10:00:00Z"
 *                 updatedAt: "2024-11-29T12:00:00Z"
 *               - id: "123e4567-e89b-12d3-a456-426614174002"
 *                 code: "PAY67890"
 *                 status: "inactive"
 *                 createdAt: "2024-11-28T11:00:00Z"
 *                 updatedAt: "2024-11-28T13:00:00Z"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/payments/code/{id}:
 *   get:
 *     summary: Get a payment code by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment code ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment code details
 *         content:
 *           application/json:
 *             example:
 *               id: "123e4567-e89b-12d3-a456-426614174000"
 *               code: "PAY12345"
 *               status: "active"
 *               createdAt: "2024-11-29T10:00:00Z"
 *               updatedAt: "2024-11-30T12:00:00Z"
 *       404:
 *         description: Payment code not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/payments/code/{id}:
 *   put:
 *     summary: Update a payment code by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment code ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "PAY98765"
 *               status:
 *                 type: string
 *                 example: "inactive"
 *     responses:
 *       200:
 *         description: Payment code updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Payment code updated successfully."
 *       404:
 *         description: Payment code not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/payments/code/{id}:
 *   delete:
 *     summary: Delete a payment code by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment code ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment code deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Payment code deleted successfully."
 *       404:
 *         description: Payment code not found
 *       500:
 *         description: Server error
 */



const express = require("express");
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const loginJWTAthentication = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/rolePermission");

router.post('/code/send',paymentController.manuallySendCode)
router.get('/code/list',paymentController.getAllCodes)
router.post('/webhook',paymentController.makePayment)
router.get('/code/:id',paymentController.getCodeById)
router.put('/code/:id',paymentController.updateCode)
router.delete('/code/:id',paymentController.updateCode)


module.exports = router;
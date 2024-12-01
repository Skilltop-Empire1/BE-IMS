/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentDetails:
 *       type: object
 *       properties:
 *         transactionId:
 *           type: string
 *           example: "txn_123456789"
 *         paymentProvider:
 *           type: string
 *           example: "mockProvider"
 *         amount:
 *           type: number
 *           example: 150.50
 *         email:
 *           type: string
 *           example: "user@example.com"
 *         subs:
 *           type: string
 *           example: "1 month"
 *     SignupCodeRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         amount:
 *           type: number
 *           example: 100
 *         subs:
 *           type: string
 *           example: "6 months"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 */

/**
 * @swagger
 * /api/manuallySendCode:
 *   post:
 *     summary: Manually send signup code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupCodeRequest'
 *     responses:
 *       200:
 *         description: Subscription successful
 *         content:
 *           application/json:
 *             example:
 *               msg: "Subscribe successfully"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/makePayment:
 *   post:
 *     summary: Process payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentDetails'
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Payment processed successfully."
 *       400:
 *         description: Invalid payment details
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid payment"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/getAllCodes:
 *   get:
 *     summary: Retrieve all codes and payments
 *     responses:
 *       200:
 *         description: List of codes and payments
 *         content:
 *           application/json:
 *             example:
 *               codes:
 *                 - email: "user1@example.com"
 *                   code: "123456"
 *                   expiresAt: "2024-12-31T00:00:00Z"
 *               pays:
 *                 - email: "user1@example.com"
 *                   amount: 150.50
 *                   paymentStatus: "completed"
 *       500:
 *         description: Error fetching data
 */

/**
 * @swagger
 * /api/getCodeById/{id}:
 *   get:
 *     summary: Get code by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "123"
 *     responses:
 *       200:
 *         description: Code details
 *         content:
 *           application/json:
 *             example:
 *               code:
 *                 email: "user1@example.com"
 *                 code: "123456"
 *                 expiresAt: "2024-12-31T00:00:00Z"
 *               pay:
 *                 email: "user1@example.com"
 *                 amount: 150.50
 *                 paymentStatus: "completed"
 *       404:
 *         description: Code not found
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
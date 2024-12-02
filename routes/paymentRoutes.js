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
 *           description: Status of the payment code (e.g., active, inactive)
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
 *               code: "PAY12345"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/payments/code/send:
 *   post:
 *     summary: Manually send a payment code
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The business name or client name
 *                 example: "John Doe Enterprises"
 *               email:
 *                 type: string
 *                 description: Client's email address
 *                 example: "johndoe@example.com"
 *               amount:
 *                 type: number
 *                 description: Payment amount for the subscription
 *                 example: 250.00
 *               subs:
 *                 type: string
 *                 description: Subscription type
 *                 example: "premium"
 *               phone:
 *                 type: string
 *                 description: Client's phone number
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: Subscription request processed successfully
 *         content:
 *           application/json:
 *             example:
 *               msg: "Subscribe successfully"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               msg: "Error message describing the issue"
 */


/**
 * @swagger
 * /api/payments/code/list:
 *   get:
 *     summary: Retrieve a list of all payment codes
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of payment codes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier for the payment code
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   email:
 *                     type: string
 *                     description: Email associated with the payment code
 *                     example: "janedoe@example.com"
 *                   businessName:
 *                     type: string
 *                     description: Name of the business or individual
 *                     example: "Jane Doe Enterprises"
 *                   code:
 *                     type: string
 *                     description: Generated payment code
 *                     example: "ABC123XYZ"
 *                   phone:
 *                     type: string
 *                     description: Contact phone number
 *                     example: "+1234567899"
 *                   subType:
 *                     type: string
 *                     description: Subscription type (duration)
 *                     example: "1 year"
 *                   paymentDate:
 *                     type: string
 *                     format: date
 *                     description: Date when the payment was made
 *                     example: "2024-12-01"
 *                   generatedBy:
 *                     type: string
 *                     description: Indicates how the code was generated
 *                     example: "manual"
 *                   expiresAt:
 *                     type: string
 *                     format: date-time
 *                     description: Expiration date of the subscription
 *                     example: "2025-12-01T00:00:00Z"
 *                   isUsed:
 *                     type: boolean
 *                     description: Whether the code has been used
 *                     example: true
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               msg: "Error retrieving payment codes"
 *               error: "Detailed error message"
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
 *         description: Payment code ID (payId)
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated client name
 *                 example: "Jane Doe Enterprises"
 *               email:
 *                 type: string
 *                 description: Updated client email
 *                 example: "janedoe@example.com"
 *               subs:
 *                 type: string
 *                 description: Subscription duration
 *                 example: "1 year"
 *               payDate:
 *                 type: string
 *                 format: date
 *                 description: Payment date for subscription
 *                 example: "2024-12-01"
 *               phone:
 *                 type: string
 *                 description: Updated phone number
 *                 example: "+1234567899"
 *               sendEmail:
 *                 type: boolean
 *                 description: Whether to send an email notification
 *                 example: true
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *                 example: 500.00
 *               paymentProvider:
 *                 type: string
 *                 description: Payment provider used
 *                 example: "PayPal"
 *               transactionId:
 *                 type: string
 *                 description: Transaction ID for the payment
 *                 example: "TXN9876543210"
 *               paymentStatus:
 *                 type: string
 *                 description: Status of the payment
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Payment code updated successfully
 *         content:
 *           application/json:
 *             example:
 *               msg: "Code updated successfully"
 *               code:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 name: "Jane Doe Enterprises"
 *                 email: "janedoe@example.com"
 *                 phone: "+1234567899"
 *                 expiresAt: "2025-12-01T00:00:00Z"
 *                 paymentDate: "2024-12-01"
 *                 isUsed: true
 *               payment:
 *                 email: "janedoe@example.com"
 *                 amount: 500.00
 *                 paymentProvider: "PayPal"
 *                 transactionId: "TXN9876543210"
 *                 paymentStatus: "completed"
 *                 paidDate: "2024-12-01"
 *       404:
 *         description: Payment code not found
 *         content:
 *           application/json:
 *             example:
 *               msg: "Code not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               msg: "Error updating code"
 *               error: "Detailed error message"
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
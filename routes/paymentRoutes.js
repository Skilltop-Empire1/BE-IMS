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
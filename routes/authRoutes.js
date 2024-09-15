const express = require("express");
const userController = require("../controllers/authController")
const {loginJWTAthentication} = require("../middlewares/authMiddleware")
const {passwordReset} = require("../middlewares/passwordResetMiddleware")
//create express router
const router = express.Router();

router.route('/signup', ).post(userController.signup)
router.route('/login'/*loginJWTAthentication*/ ).post( userController.login)
router.route('/password-reset' /*passwordReset*/ ).post( userController.passwordReset)

module.exports = router;
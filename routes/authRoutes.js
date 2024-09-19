const express = require("express");
const userController = require("../controllers/authController")
const {loginJWTAthentication} = require("../middlewares/authMiddleware")
const {passwordReset} = require("../middlewares/passwordResetMiddleware")
//create express router
const router = express.Router();

router.route('/get-users', loginJWTAthentication ).get(userController.getAllUsers)
router.route('/signup' ).post(userController.signup)
router.route('/login', loginJWTAthentication ).post( userController.login)
router.route('/password-reset' ).post( userController.passwordReset)
router.route('/submit-reset').put( userController.resetSubmit)
router.route('/logout').get( userController.logout)
// router.route('/home-page', loginJWTAthentication).get( userController.homePage)


module.exports = router;
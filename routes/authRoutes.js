const express = require("express");
const userController = require("../controllers/authController")
const {loginJWTAthentication} = require("../middlewares/authMiddleware")

//create express router
const router = express.Router();

router.route('/signup', ).post(userController.signup)
router.route('/login'/*loginJWTAthentication*/ ).post( userController.login)

module.exports = router;
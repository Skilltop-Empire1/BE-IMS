const express = require("express");
const userController = require("../controllers/planController")
//create express router
const router = express.Router();
router.route('/chose-plan').post(userController.plan)
router.route('/subscribers').get(userController.planList)

module.exports = router;
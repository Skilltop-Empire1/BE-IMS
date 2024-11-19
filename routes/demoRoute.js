const express = require("express");
const demoController = require("../controllers/demoController")
//create express router
const router = express.Router();
router.route('/request-demo').post(demoController.requestDemo)
router.route('/demo-list').get(demoController.demoList)

module.exports = router;
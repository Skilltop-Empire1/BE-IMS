const express = require("express");
const router = express.Router()
const notificationController = require("../controllers/notificationController")
const loginJWTAthentication = require("../middlewares/authMiddleware")


router.post ("/read",notificationController.notificationRead)
router.get("/",loginJWTAthentication,notificationController.createNotifications)


module.exports = router
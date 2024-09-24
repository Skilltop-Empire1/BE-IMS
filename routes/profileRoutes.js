const express = require("express");

const loginJWTAthentication = require('../middlewares/authMiddleware')

//create express router
const router = express.Router();
const profileController = require('../controllers/profileController');
router.post('/upload',loginJWTAthentication, profileController.uploadProfilePic);
router.get('/profilePic',loginJWTAthentication, profileController.getProfilePic);


module.exports = router;
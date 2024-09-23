const express = require("express");


//create express router
const router = express.Router();
const profileController = require('../controllers/profileController');

router.post('/upload', profileController.uploadProfilePic);

router.get('/:userId', profileController.getProfilePic);


module.exports = router;
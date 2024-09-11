const express = require("express");
//create express router
const router = express.Router();
const storeController = require('../controllers/storeController');
// const { authenticateToken } = require('../middlewares/authMiddleware');
router.post('/create', storeController.createStore);
router.get('/all',  storeController.getAllStores);
router.get('/:storeId/info', storeController.getStoreInfo);


<<<<<<< HEAD
router.delete('/delete/:storeId', storeController.deleteStoreById);  // Delete store by ID
router.put('/edit/:storeId', storeController.editStoreById);//Edit store by ID 
=======


>>>>>>> c5dedcb30e66a1068ad8dc52b60d039136ddc3e0
module.exports = router;
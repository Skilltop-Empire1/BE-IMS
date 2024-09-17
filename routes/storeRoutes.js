const express = require("express");
//create express router
const router = express.Router();
const storeController = require('../controllers/storeController');
// const { authenticateToken } = require('../middlewares/authMiddleware');
router.post('/create', storeController.createStore);
router.get('/all',  storeController.getAllStores);
router.get('/:storeId/info', storeController.getStoreInfo);
router.get('/search', storeController.searchStore);
router.get('/filter', storeController.filterByLocation);



//CREATE A TEMPORARY USER TO TEST
router.post('/createTempUser',  storeController.createTemporaryUserForTest);


//The two routes below are not in the actual project requirements or ticket but are there for future use
router.delete('/delete/:storeId', storeController.deleteStoreById);  // Delete store by ID
router.put('/edit/:storeId', storeController.editStoreById);//Edit store by ID 
module.exports = router;
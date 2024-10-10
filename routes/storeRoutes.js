const express = require("express");
//create express router
const router = express.Router();
const storeController = require('../controllers/storeController');
const loginJWTAthentication = require('../middlewares/authMiddleware')
const authorise = require('../middlewares/rolePermission')
// const { authenticateToken } = require('../middlewares/authMiddleware');
router.post('/create',loginJWTAthentication,authorise("Store","create"), storeController.createStore);
router.get('/all', loginJWTAthentication,authorise("Store","view"), storeController.getAllStores);
router.get('/:storeId/info',loginJWTAthentication,authorise("Store","view"),  storeController.getStoreInfo);
router.get('/search',loginJWTAthentication,  storeController.searchStore);
router.get('/filter',loginJWTAthentication,authorise("Store","view"),   storeController.filterByLocation);
router.get('/overview',loginJWTAthentication,authorise("Store","view"),   storeController.getStoreOverview);

//The two routes below are not in the actual project requirements or ticket but are there for future use
router.delete('/delete/:storeId',loginJWTAthentication,authorise("Store","create"),  storeController.deleteStoreById);  // Delete store by ID
router.put('/edit/:storeId',loginJWTAthentication,authorise("Store","edit"), storeController.editStoreById);//Edit store by ID 

module.exports = router;
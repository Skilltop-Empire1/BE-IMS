
const express = require('express');
const router = express.Router();
const veryfytoken = require('../middlewares/authMiddleware')
const authorize = require('../middlewares/rolePermission')
const  {
    createSalesRecord,
    getSalesRecords, 
    getSalesRecordById,
    updateSalesRecord, 
    deleteSalesRecord,
    getSalesRecordByProductId
  }  = require('../controllers/salesController');

router.post('/create', veryfytoken, authorize, createSalesRecord);

router.get('/get', veryfytoken,authorize, getSalesRecords);

router.get('/product/:productId',authorize, getSalesRecordByProductId);

router.get('/get/:id',veryfytoken,authorize, getSalesRecordById);

router.put('/update/:id',veryfytoken,authorize, updateSalesRecord);

router.delete('/delete/:id',veryfytoken,authorize, deleteSalesRecord);

module.exports = router;

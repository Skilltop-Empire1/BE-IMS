
const express = require('express');
const router = express.Router();
const  {
    createSalesRecord,
    getSalesRecords, 
    getSalesRecordById,
    updateSalesRecord, 
    deleteSalesRecord,
    getSalesRecordByProductId
  }  = require('../controllers/salesController');

router.post('/create', createSalesRecord);

router.get('/get', getSalesRecords);

router.get('/product/:productId', getSalesRecordByProductId);

router.get('/get/:id', getSalesRecordById);

router.put('/update/:id',updateSalesRecord);

router.delete('/delete/:id',deleteSalesRecord);

module.exports = router;

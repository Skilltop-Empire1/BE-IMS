
const express = require('express');
const router = express.Router();
const Verifytoken = require("../middlewares/authMiddleware");
const  {
    createSalesRecord,
    getSalesRecords, 
    getSalesRecordById,
    updateSalesRecord, 
    deleteSalesRecord,
    getSalesRecordByProductId
  }  = require('../controllers/salesController');

router.post('/create',Verifytoken, createSalesRecord);

router.get('/get', getSalesRecords);

router.get('/product/:productId', getSalesRecordByProductId);

router.get('/get/:id', getSalesRecordById);

router.put('/update/:id',updateSalesRecord);

router.delete('/delete/:id',deleteSalesRecord);

module.exports = router;

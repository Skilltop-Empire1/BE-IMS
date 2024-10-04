
const express = require('express');
const router = express.Router();
const veryfytoken = require('../middlewares/authMiddleware')
const  {
    createSalesRecord,
    getSalesRecords, 
    getSalesRecordById,
    updateSalesRecord, 
    deleteSalesRecord,
    getSalesRecordByProductId
  }  = require('../controllers/salesController');

router.post('/create', createSalesRecord);

router.get('/get', veryfytoken, getSalesRecords);

router.get('/product/:productId', getSalesRecordByProductId);

router.get('/get/:id',veryfytoken, getSalesRecordById);

router.put('/update/:id',veryfytoken, updateSalesRecord);

router.delete('/delete/:id',veryfytoken, deleteSalesRecord);

module.exports = router;

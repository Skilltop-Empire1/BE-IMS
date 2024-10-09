
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

router.post('/create', veryfytoken,authorize("Sales Records","create"), createSalesRecord);

router.get('/get', veryfytoken,authorize("Sales Records","view"), getSalesRecords);

router.get('/product/:productId',veryfytoken,authorize("Sales Records","view"), getSalesRecordByProductId);

router.get('/get/:id',veryfytoken,authorize("Sales Records","view"), getSalesRecordById);

router.put('/update/:id',veryfytoken,authorize("Sales Records","edit"), updateSalesRecord);

router.delete('/delete/:id',veryfytoken,authorize("Sales Records","aproval"), deleteSalesRecord);

module.exports = router;

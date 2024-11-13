const express = require('express');
const router = express.Router();
const upload = require("../middlewares/multer")

const {
  createExpenditure,
  getAllExpenditures,
  getExpenditureById,
  updateExpenditure,
  deleteExpenditure,
} = require('../controllers/expenditureController'); 

router.post('/create',upload.single("receipt"), createExpenditure);
router.get('/list', getAllExpenditures);
router.get('/:id', getExpenditureById);
router.put('/:id',upload.single("receipt"), updateExpenditure);
router.delete('/:id', deleteExpenditure);

module.exports = router;

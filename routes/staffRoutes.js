const express = require('express');
const router = express.Router();
const veryfytoken = require('../middlewares/authMiddleware')

const { getStaffList, 
    getStaffById, 
    deleteStaff, 
    updateStaff, 
    inviteStaff } = require('../controllers/staffControllers');

router.get('/', getStaffList);

router.get('/:id', getStaffById);

router.put('/:id', updateStaff);

router.delete('/:id', deleteStaff);

router.post('/invite',veryfytoken, inviteStaff);

module.exports = router;

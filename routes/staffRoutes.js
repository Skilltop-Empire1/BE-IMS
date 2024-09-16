const express = require('express');
const router = express.Router();
const { getStaffList, 
    getStaffById, 
    deleteStaff, 
    updateStaff, 
    inviteStaff } = require('../controllers/staffControllers');

router.get('/', getStaffList);

router.get('/:id', getStaffById);

router.put('/:id', updateStaff);

router.delete('/:id', deleteStaff);

router.post('/invite', inviteStaff);

module.exports = router;

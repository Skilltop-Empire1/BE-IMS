const express = require('express');
const router = express.Router();
const veryfytoken = require('../middlewares/authMiddleware')

const { getStaffList, 
    getStaffById, 
    deleteStaff, 
    updateStaff, 
    inviteStaff,
    updatePermissions } = require('../controllers/staffControllers');

router.get('/', veryfytoken, getStaffList);

router.get('/:id',veryfytoken, getStaffById);

router.put('/update/:id',veryfytoken, updateStaff);

router.put('/updatepem/:id',veryfytoken, updatePermissions);

router.delete('/delete/:id',veryfytoken, deleteStaff);

router.post('/invite',veryfytoken, inviteStaff);

module.exports = router;

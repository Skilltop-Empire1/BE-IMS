const {Staff, User, Store}  = require('../models');
const nodemailer = require('nodemailer')
const veryfytoken = require('../middlewares/authMiddleware')
const bcrypt = require('bcryptjs');


    let mailTransporter = nodemailer.createTransport({
      host: "mail.skilltopims.com",  
      port: 587, 
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    

  // Get paginated list of all staff
 const  getStaffList = async (req, res) => {
    try {
      let { userId, role, Store} = req.user; 
    userId = role === 'superAdmin' ? userId : (await Staff.findOne({ where: { userId: userId } })).userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await Staff.findAndCountAll({ where: { userId: userId }, limit, offset },{
        include:[{model:Store,where:{userId}}]
      });

      const totalPages = Math.ceil(count / limit);

      const staffList = rows.map((staff) => ({
        staffId:staff.staffId,
        username: staff.username,
        email: staff.email,
        added_date: staff.addedDate,
        status: staff.status,
        role: staff.role,
        store_name: staff.storeName,
        permissions:staff.permissions
      }));

      return res.status(200).json({
        success: true,
        message: 'Staff fetched successfully',
        data: staffList,
        pagination: {
          totalItems: count,
          totalPages: totalPages,
          currentPage: page,
        },
      });
    } catch (err) {
      console.error('Error fetching staff list:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get staff by ID
const getStaffById = async (req, res) => {
    try {
      let { userId, role } = req.user; // Assuming req.user is the object
      userId = role === 'superAdmin' ? userId : (await Staff.findOne({ where: { staffId: userId } })).userId;
      const { id } = req.params;
      const staff = await Staff.findByPk(id,{
        include:[{model:Store,where:{userId}}]
      });

      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }

      const response = {
        id: staff.id,
       // firstName: staff.username.split(' ')[0], // Assuming first name is part of username
//lastName: staff.username.split(' ')[1],  // Assuming last name is part of username
        email: staff.email,
        role: {
          id: staff.role,
          name: staff.role,
          permissions: staff.permissions || {},
        },
      };

      return res.status(200).json(response);
    } catch (err) {
      console.error('Error fetching staff by ID:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update staff by ID

const updateStaff = async (req, res) => {
  try {
    let { userId, role } = req.user; 
    userId = role === 'superAdmin' ? userId : (await Staff.findOne({ where: { staffId: userId } })).userId;

    const { id } = req.params; 
    const updateData = req.body;

    const staff = await Staff.findByPk(id, {
     // include: [{ model: Store, where: { userId } }] 
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    await Staff.update(updateData, { where: { staffId: id } });

    const updatedStaff = await Staff.findByPk(id);

    return res.status(200).json({
      id: updatedStaff.id,
      email: updatedStaff.email,
      role: updatedStaff.role,
      name: updatedStaff.name,
      permissions: updatedStaff.permissions,
    });
  } catch (err) {
    console.error('Error updating staff:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Delete staff by ID
const deleteStaff = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Staff.destroy({ where: { staffId: id } });

      if (!deleted) {
        return res.status(404).json({ message: 'Staff not found' });
      }

      return res.status(204).json({ message: 'staff deleted succesfully'});
    } catch (err) {
      console.error('Error deleting staff:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
};


const inviteStaff = async (req, res) => {

  try {

    let { userId, role } = req.user; // Assuming req.user is the object
    userId = role === 'superAdmin' ? userId : (await Staff.findOne({ where: { staffId: userId } })).userId;
    //const user = req.user;
  

    const { email, password, username } = req.body;
    if (!email || !password, !username) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the email already exists in staff
    const existingStaff = await Staff.findOne({ where: { email: email } });
    if (existingStaff) {
      return res.status(400).json({ message: 'Email already exists as a staff' });
    }

    const userExistingStaff = await User.findOne({ where: { email: email } });
    if (userExistingStaff) {
      return res.status(400).json({ message: 'Email already exists as a user' });
    }


    // Hash the password before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const admin = req.user.username
  
    
    const url = process.env.CLIENT2_URL ;
    const newStaff = await Staff.create({
      userId,//:user.userId
      username,
      email,
      password: hashedPassword,  // Save the hashed password
      addedDate: new Date(),
  });
    let mailOption = {
      from: process.env.EMAIL_USER,
      to: newStaff.email,
      subject: "You have been invited as a Staff Member",
      html: `<h2>Hi ${newStaff.username},</h2>
      <p>You have been invited by ${admin} to join as a staff member.</p>
      <p>Please use the credentials below to log in by clicking on this <a href="${url}">link</a>:</p>
      <p>Email: ${newStaff.email}<br>
      Password: ${password}</p>` 
    };

    // Sending the email
    mailTransporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent to the staff account');
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Staff invited successfully, email has been sent to the staff email account',
      data: {
        user:req.user.username,
        id: newStaff.id,
        email: newStaff.email,
        status: newStaff.status,
        role: newStaff.role,
      },
    });
  } catch (err) {
    console.error('Error inviting staff:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const updatePermissions = async (req, res) => {
  try {
    
    // Check if user is superAdmin
    const role = req.user.role;
    if (role !== "superAdmin") {
      return res.status(401).json({ message: 'You are not allowed to access this route' });
    }

    // Extract staffId from the request parameters
    const { id: staffId } = req.params;

    // Extract permissions from the request body
    const { permissions } = req.body;

    // Find the staff member
    const staff = await Staff.findOne({ where: { staffId } });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Update the permissions field with the new permissions array
    staff.permissions = permissions;

    // Save updated permissions
    await staff.save();

    console.log("updatedPermissions", permissions);

    return res.status(200).json({
      message: 'Permissions updated successfully',
      permissions: staff.permissions,
    });
  } catch (err) {
    console.error('Error updating permissions:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Export class instance
module.exports = {
    getStaffList, getStaffById, deleteStaff, updateStaff, inviteStaff, updatePermissions
};

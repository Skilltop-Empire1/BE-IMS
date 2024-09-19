const {Staff}  = require('../models');
const nodemailer = require('nodemailer')
    


    let mailTransporter = nodemailer.createTransport({
      host: "mail.skilltopims.com",  
      port: 587, 
      secure: false,  
      auth: {
        user: 'kizohills@skilltopims.com',
        pass: 'Kizohills$$1234'  
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    

  // Get paginated list of all staff
 const  getStaffList = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await Staff.findAndCountAll({ limit, offset });

      const totalPages = Math.ceil(count / limit);

      const staffList = rows.map((staff) => ({
        staffId:staff.staffId,
        username: staff.username,
        email: staff.email,
        added_date: staff.addedDate,
        status: staff.status,
        role: staff.role,
        store_name: staff.storeName,
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
       
      const { id } = req.params;
      const staff = await Staff.findByPk(id);

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
      const { id } = req.params;
      const { status, role, permissions } = req.body;

      const staff = await Staff.findByPk(id);

      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }

      await Staff.update({ status, role, permissions }, { where: { id } });

      const updatedStaff = await Staff.findByPk(id);
      return res.status(200).json({
        id: updatedStaff.id,
       // firstName: updatedStaff.username.split(' ')[0],
       // lastName: updatedStaff.username.split(' ')[1],
        email: updatedStaff.email,
        role: {
          id: updatedStaff.role,
          name: updatedStaff.role,
          permissions: updatedStaff.permissions,
        },
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

// Create staff (Invite staff)
const inviteStaff = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }


      const newStaff = await Staff.create({
        email,
        password, 
        addedDate: new Date(),
        status: 'active',
        role: 'Employee',
        storeName: 'Store 1', 
      });

      let mailOption = {
        from: "kizohills@skilltopims.com",
        to: newStaff.email,
        subject: "You have been invited as a Staff Member",
        html: `<h2> hi ${newStaff.name}! Hello, you have been invited to
         join as a staff member. Please use this credentials 
         to log in email ${newStaff.email} and password${newStaff.password}</h2>`
      }
      // sending email
      mailTransporter.sendMail(mailOption, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('email is sent to the staff account');
        }
      })

      return res.status(201).json({
        success: true,
        message: 'Staff invited successfully, email is sent to the staff account',
        data: {
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

// Export class instance
module.exports = {
    getStaffList, getStaffById, deleteStaff, updateStaff, inviteStaff
};


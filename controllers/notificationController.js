const {Staff, Notification} = require("../models")


const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;  // Assuming user ID is available in req.user
    const notifications = await Notification.findAll({ where: { userId } });
    
    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};


const staffAcceptInvite = async (staffId) => {
    const staff = await Staff.findByPk(staffId);
    if (staff) {
      staff.status = 'active';
      await staff.save();
  
    io.emit('staffInviteAccepted', {
      message: `${staff.username} has accepted the invite`,
      staffId: staff.staffId,
    });
      
      await sequelize.models.Notification.create({
        message: `${staff.username} has accepted the invite`,
        type: 'staff',
        userId: 1,  // Customize this based on who should receive the notification
      });
    }
  };

  const acceptInvite = async (staffId) => {
    const staff = await Staff.findByPk(staffId);
    if (staff) {
      staff.status = 'active';
      await staff.save();
  
      const inviterId = staff.invitedBy;  // Get the user who invited the staff
      const inviterSocketId = userSocketMap[inviterId];  // Get the socket id of the inviter
  
      if (inviterSocketId) {
        // Emit notification to the specific user
        io.to(inviterSocketId).emit('staffInviteAccepted', {
          message: `${staff.username} has accepted the invite`,
          staffId: staff.staffId,
        });
  
        // Optionally, save the notification in the database
        await sequelize.models.Notification.create({
          message: `${staff.username} has accepted the invite`,
          type: 'staff',
          userId: inviterId,  // Save notification for the inviting user
        });
      }
    }
  };
  
  

  const notificationRead =  async (req, res) => {
    await Notification.update({ status: 'read' }, { where: { userId: req.user.id } });
    res.sendStatus(200);
  };
  

  module.exports = {staffAcceptInvite,notificationRead,acceptInvite,getNotifications}
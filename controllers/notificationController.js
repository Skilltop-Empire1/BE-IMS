// const {Staff, Notification, SalesRecord,Product} = require("../models")
// const { getUserSocketMap } = require("../config/socket");
// const userSocketMap = getUserSocketMap();

// const createNotifications = async (io,productId,quantity,userId,res) => {
//   try {
//     //const io = app.get("io");
//     const socketId = userSocketMap[userId];
//     //const userId = req.user.id;  
//     const product = await Product.findByPk(productId)
//     if(!product){
//       return res.status(404).json({message:"product not found"})
//     }
//     if(product.quantity < quantity){
//       return res.status(401).json({msg:"Insufficient stock"})
//     }
//     product.quantity -= quantity
//     await product.save()
    
//     if(product.quantity <= product.alertStatus){
//       //emit to particular user
//       console.log("socketId",socketId)
//       if(socketId){
//         console.log("socketId",socketId)
//         io.to(socketId/*`user_${userId}`*/).emit('productAlert',{
//           message:`The quantity of ${product.name} is low (Current: ${product.quantity})`,
//           productId:product.prodId
//         })
//         console.log("message",message)
//       }else{
//         console.error(`User ${userId} is not connected.`);
//       }
//     }
//     //create notification
//     const notification = await Notification.create({
//       message: `The quantity of ${product.name} is low (Current: ${product.quantity})`,
//       type: 'product',
//       userId: userId,
//     })
    
//     // res.status(200).json({
//     //   success: true,
//     //   data: notification
//     // });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create notifications",
//     });
//   }
// };

const { Staff, Notification, SalesRecord, Product } = require("../models");
const { getUserSocketMap } = require("../config/socket");
const userSocketMap = getUserSocketMap();

const createNotifications = async (io, productId, quantity, userId, res) => {
  try {
    const socketId = userSocketMap[userId];
    console.log("userSocketId", socketId);

    // Fetch the product details
    const product = await Product.findByPk(productId);
    if (!product) {
      // Stop the function if product is not found
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure there is enough stock
    if (product.quantity < quantity) {
      // Stop the function if insufficient stock
      return res.status(401).json({ msg: "Insufficient stock" });
    }

    // Update product quantity
    product.quantity -= quantity;
    await product.save();

    // Send product alert if quantity is below alert threshold
    if (product.quantity <= product.alertStatus) {
      console.log("socketId:", socketId);
      if (socketId) {
        // Emit a 'productAlert' event to the user
        const alertMessage = `The quantity of ${product.name} is low (Current: ${product.quantity})`;
        io.to(socketId).emit('productAlert', {
          message: alertMessage,
          productId: product.prodId,
        });
        console.log("Emitting message:", alertMessage);
      } else {
        console.error(`User ${userId} is not connected.`);
      }
    }
        // Create a notification in the database
        await Notification.create({
          message: `The quantity of ${product.name} is low (Current: ${product.quantity})`,
          type: 'product',
          userId: userId,
        });
    
  } catch (err) {
    console.error("Error in creating notification:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const staffAcceptInvite = async (staffId) => {
    const staff = await Staff.findByPk(staffId);
    if (staff) {
      staff.status = 'active';
      await staff.save();
  
    io.to(`user_${userId}`).emit('staffInviteAccepted', {
      message: `${staff.username} has accepted the invite`,
      staffId: staff.staffId,
    });
      
      await sequelize.models.Notification.create({
        message: `${staff.username} has accepted the invite`,
        type: 'staff',
        userId: userId,  // Customize this based on who should receive the notification
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
  

  module.exports = {staffAcceptInvite,notificationRead,acceptInvite,createNotifications}
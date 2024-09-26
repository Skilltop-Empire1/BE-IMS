
const { Server } = require("socket.io");
const userSocketMap = {};
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ["POST", "GET"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} connected with socket id: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of Object.entries(userSocketMap)) {
        if (socketId === socket.id) {
          delete userSocketMap[userId];
          console.log(`User ${userId} disconnected`);
        }
      }
    });
  });

  return io;
};

const getUserSocketMap = () => userSocketMap;

module.exports = {
  initializeSocket,
  getUserSocketMap,
};

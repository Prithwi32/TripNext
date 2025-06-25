const onlineUsers = new Map();
const userRooms = new Map(); // Track which rooms each user is in

export let io;

export const registerSocketServer = (_io) => {
  io = _io;

  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    
    const userId = socket.handshake.query.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ${socket.id}`);
    }

    // Handle room joining
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      userRooms.set(socket.id, roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Handle room leaving
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      userRooms.delete(socket.id);
      console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      // Clean up user tracking
      onlineUsers.forEach((value, key) => {
        if (value === socket.id) {
          onlineUsers.delete(key);
          console.log(`Removed user ${key} from online users`);
        }
      });

      // Clean up room tracking
      if (userRooms.has(socket.id)) {
        userRooms.delete(socket.id);
      }
    });

    // Error handling
    socket.on("error", (error) => {
      console.error(`Socket error (${socket.id}):`, error);
    });
  });
};

export const getRecieverSocketId = (receiverId) => {
  return onlineUsers.get(receiverId);
};
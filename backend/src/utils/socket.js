const onlineUsers = new Map();

export let io;

export const registerSocketServer = (_io) => {
  io = _io;

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
    }

    socket.on("disconnect", () => {
      onlineUsers.forEach((value, key) => {
        if (value === socket.id) {
          onlineUsers.delete(key);
        }
      });
    });
  });
};

export const getRecieverSocketId = (receiverId) => {
  return onlineUsers.get(receiverId);
};

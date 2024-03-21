let io;

module.exports = {
  initializeServer: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
        credentials: true,
        allowedHeaders: "*",
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }
    return io;
  },
};

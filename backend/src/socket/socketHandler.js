const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

module.exports = (io) => {

  // Authenticate socket using JWT from handshake
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, name, email }
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} | User: ${socket.user.name}`);

    // Join a room
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.user.name} joined room: ${roomId}`);
    });

    // Send a message
    socket.on("send_message", async (data, callback) => {
      try {
        const { roomId, content, type = "text", language = null } = data;

        if (!roomId || !content) {
          return callback?.({ error: "roomId and content are required" });
        }

        const message = await Message.create({
          roomId,
          senderId: socket.user.id,
          content,
          type,
          language,
        });

        await message.populate("senderId", "name email");

        // Broadcast to everyone in the room including sender
        io.to(roomId).emit("new_message", message);

        callback?.({ success: true });
      } catch (err) {
        console.error("send_message error:", err.message);
        callback?.({ error: "Failed to send message" });
      }
    });

    // Leave a room
    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      console.log(`${socket.user.name} left room: ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
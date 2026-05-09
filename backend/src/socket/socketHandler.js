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

    // Edit a message
    socket.on("edit_message", async (data, callback) => {
      try {
        const { messageId, content } = data;
        if (!messageId || !content) {
          return callback?.({ error: "messageId and content are required" });
        }

        const message = await Message.findById(messageId);
        if (!message) return callback?.({ error: "Message not found" });
        if (message.senderId.toString() !== socket.user.id) {
          return callback?.({ error: "Not authorized" });
        }
        if (message.deleted) {
          return callback?.({ error: "Cannot edit a deleted message" });
        }

        message.content = content;
        message.edited = true;
        message.editedAt = new Date();
        await message.save();

        await message.populate("senderId", "name email");
        io.to(message.roomId.toString()).emit("update_message", message);

        callback?.({ success: true });
      } catch (err) {
        console.error("edit_message error:", err.message);
        callback?.({ error: "Failed to edit message" });
      }
    });

    // Soft delete a message
    socket.on("delete_message", async (data, callback) => {
      try {
        const { messageId } = data;
        if (!messageId) {
          return callback?.({ error: "messageId is required" });
        }

        const message = await Message.findById(messageId);
        if (!message) return callback?.({ error: "Message not found" });
        if (message.senderId.toString() !== socket.user.id) {
          return callback?.({ error: "Not authorized" });
        }

        message.deleted = true;
        message.deletedAt = new Date();
        await message.save();

        await message.populate("senderId", "name email");
        io.to(message.roomId.toString()).emit("update_message", message);

        callback?.({ success: true });
      } catch (err) {
        console.error("delete_message error:", err.message);
        callback?.({ error: "Failed to delete message" });
      }
    });

    // Leave a room
    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      console.log(`${socket.user.name} left room: ${roomId}`);
    });

    // Typing indicators
    socket.on("typing_start", (roomId) => {
      socket.to(roomId).emit("user_typing", { name: socket.user.name });
    });

    socket.on("typing_stop", (roomId) => {
      socket.to(roomId).emit("user_stop_typing", { name: socket.user.name });
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
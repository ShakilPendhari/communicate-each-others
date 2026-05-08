const Room = require("../models/Room");

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("createdBy", "name email").sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ message: "Room name required" });

    const exists = await Room.findOne({ name });
    if (exists)
      return res.status(409).json({ message: "Room already exists" });

    const room = await Room.create({ name, createdBy: req.user.id });
    await room.populate("createdBy", "name email");

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
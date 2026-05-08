const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const { getRooms, createRoom } = require("../controllers/roomController");

router.get("/", authMiddleware, getRooms);
router.post("/", authMiddleware, createRoom);

module.exports = router;
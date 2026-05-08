const router = require("express").Router();
const { getMessages } = require("../controllers/messageController");
const auth = require("../middleware/authMiddleware");

router.get("/:roomId", auth, getMessages);

module.exports = router;
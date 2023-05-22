const express = require("express");
const router = express.Router();
const RoomsSchema = require("../schema/rooms_schema");

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const rooms = await RoomsSchema.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve contacts" });
  }
});

//Create One
router.post("/", async (req, res) => {
  const check = await CheckAuth(req, res);
  if (check.auth === false) {
    return res.status(401).json({ message: "Unauthorized", auth: false });
  }

  // const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  const msg = new RoomsSchema({
    room_type: req.body.chat_room_id,
    user_id: req.check.data._id,
    participant_id: req.body.content_type,
  });
  try {
    await msg.save();
    res
      .status(201)
      .json({ message: "Message was sent successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = router;

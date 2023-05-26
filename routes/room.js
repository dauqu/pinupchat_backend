const express = require("express");
const router = express.Router();
const RoomSchema = require("./../schema/room_schema");

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const room = await RoomSchema.find();
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve contacts" });
  }
});

//Post a room
router.post("/", async (req, res) => {
  try {
    const room = await RoomSchema.create({
      name: req.body.name,
      type: req.body.type,
    });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Failed to create room" });
  }
});

//Delete Room
router.delete("/:id", async (req, res) => {
  try {
    const room = await RoomSchema.findByIdAndDelete(req.params.id);
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete room" });
  }
});

module.exports = router;

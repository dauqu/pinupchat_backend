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



module.exports = router;

const express = require("express");
const router = express.Router();
const ChatSchema = require("./../schema/chat_schema");
const CheckAuth = require("./../functions/check_auth");
const ContactsSchema = require("../schema/contacts_schema");

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const chat = await ChatSchema.find();
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve chat" });
  }
});

//Get chaat by room_id
router.get("/:room_id", async (req, res) => {
  try {
    const chat = await ChatSchema.find({
      room_id: req.params.room_id,
    }).populate({
      path: "sender_id",
      select: "-password -email -phone -role -rpt",
    });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve chat" });
  }
});


//Get chaat by room_id
router.get("/search/:room_id", async (req, res) => {
  try {
    // const chat = await ChatSchema.find({
    //   room_id: req.params.room_id,
    // }).populate({
    //   path: "sender_id",
    //   select: "-password -email -phone -role -rpt",
    // });
    // res.json(chat);

    //Search message 
    const chat = await ChatSchema.find({
      room_id: req.params.room_id,
      
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve chat" });
  }
});

//Post a room
router.post("/", async (req, res) => {
  const auth = await CheckAuth(req, res);

  const roomId = req.body.room;
  
  // Check if room exists
  try {
    const room = await ContactsSchema.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the room" });
  }

  try {
    const chat = await ChatSchema.create({
      attachments: req.body.attachments,
      sender: auth.data._id,
      room_id: roomId,
      message: req.body.message,
      parant_message_id: req.body.parant_message_id,
    });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to create chat" });
  }
});

//Delete Room
router.delete("/:id", async (req, res) => {
  try {
    const chat = await ChatSchema.findByIdAndDelete(req.params.id);
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete room" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const PrivateChat = require("../schema/private_chat_schema");
const CheckAuth = require("./../functions/check_auth");

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const message = await PrivateChat.find();
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve contacts" });
  }
});

// Create a new private chat
router.post("/", async (req, res) => {
  //Check Auth
  const check = await CheckAuth(req, res);
  if (check.auth === false) {
    return res.status(401).json({ message: "Unauthorized", auth: false });
  }

  try {
    const privateChat = new PrivateChat({
      sender_id: check.data._id,
      recipient_id: req.body.recipient_id,
      type: req.body.type,
      message: req.body.message,
      parant_message_id: req.body.parant_message_id,
    });
    const savedPrivateChat = await privateChat.save();
    res.status(201).json(savedPrivateChat);
  } catch (error) {
    res.status(400).json({ message: "Error creating private chat" });
  }
});

// Delete a private chat by ID
router.delete("/:id", async (req, res) => {
  try {
    const privateChat = await PrivateChat.findByIdAndDelete(req.params.id);
    if (!privateChat) {
      return res.status(404).json({ message: "Private chat not found" });
    }
    res.json({ message: "Private chat deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting private chat" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const MessageSchema = require("../schema/private_chat_schema");
const CheckAuth = require("./../functions/check_auth");

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const message = await MessageSchema.find().populate({
      path: "sender_id",
      select: "-password -email -phone -role -rpt",
    });
    res.json(message);
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
  const msg = new MessageSchema({
    chat_room_id: req.body.chat_room_id,
    sender_id: check.data._id,
    content_type: req.body.content_type,
    content: req.body.content,
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

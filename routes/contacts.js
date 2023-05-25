const express = require("express");
const router = express.Router();
const ContactsSchema = require("../schema/contacts_schema");
const UsersSchema = require("../schema/user_schema");
const CheckAuth = require("../functions/check_auth");

// GET rooms for the current user
router.get("/my", async (req, res) => {
  const check = await CheckAuth(req, res);
  if (check.auth === false) {
    return res.status(401).json({ message: "Unauthorized", auth: false });
  }

  try {
    const rooms = await ContactsSchema.find({
      user_id: check.data._id,
    }).populate({
      path: "participant_id",
      select: "-password -email -phone -role -rpt",
    });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve rooms" });
  }
});

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const rooms = await ContactsSchema.find().populate({
      path: "participant_id",
      select: "-password -email -phone -role -rpt",
    });
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

  //Check if user exists
  const user = await UsersSchema.findOne({ _id: req.body.participant_id });

  if (!user) {
    return res.status(404).json({ message: "User not found", status: "error" });
  }

  // Check if participant already exists in the room
  const existingRoom = await ContactsSchema.findOne({
    user_id: check.data._id,
    participant_id: req.body.participant_id,
  });

  if (existingRoom) {
    return res.status(400).json({
      message: "Participant already exists in the room",
      status: "error",
    });
  }

  // const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  const msg = new ContactsSchema({
    user_id: check.data._id,
    participant_id: req.body.participant_id,
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

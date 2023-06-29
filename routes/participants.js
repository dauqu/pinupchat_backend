const express = require("express");
const router = express.Router();
const ParticipantsSchema = require("./../schema/participants_schema");
const CheckAuth = require("./../functions/check_auth");
const RoomSchema = require("./../schema/room_schema");
const UsersSchema = require("./../schema/user_schema");

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const participants = await ParticipantsSchema.find();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve participants" });
  }
});

//Get participants where mine
router.get("/mine", async (req, res) => {
  //Check Auth
  const auth = await CheckAuth(req, res);

  try {

    const my_rooms = await ParticipantsSchema.find({
      user_id: auth.data._id,
    });

    const room_ids = my_rooms.map((room) => room.room_id);

    const myparticipants = await ParticipantsSchema.find({
      room_id: { $in: room_ids },
    }).populate({
      path: "user_id",
      select: "-password -email -phone -role -rpt",
      match: { _id: { $ne: auth.data._id } },
    });

    //Filter data
    const filtered = myparticipants.filter(
      (participant) => participant.user_id !== null
    );

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve participants" });
  }
});

//Get participants by ID
router.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const participants = await ParticipantsSchema.find({
      room_id: id,
    });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve participants" });
  }
});

//Post a room
router.post("/", async (req, res) => {
  const auth = await CheckAuth(req, res);
  if (auth.auth === false) {
    return res.status(401).json({ message: "Unauthorized", auth: false });
  }

  const friend_id = req.body.friend;
  const my_id = auth.data._id.toString();

  //Return if friend is not provided
  if (!friend_id) {
    return res.json({ message: "All Field is not provided", status: "failed" });
  }

  //Check friend is exist or not
  const friend = await UsersSchema.findById(friend_id);
  if (!friend) {
    return res.json({ message: "Friend not found", status: "failed" });
  }

  //Check my id and friend id is same or not
  if (friend_id === my_id) {
    return res.json({
      message: "You can't create room with yourself",
      status: "failed",
    });
  }

  try {
    // Create new room and return the ID
    const room = await RoomSchema({
      type: "private",
      name: "Private Chat",
    });

    await room.save();

    //Check if i have a room with this friend
    const check = await ParticipantsSchema.findOne({
      user_id: friend_id,
      room_id: room._id.toString(),
    });

    if (check) {
      return res.json({
        message: "You already have a room with this friend",
        status: "failed",
      });
    }

    //Add participants to the room
    const participant = new ParticipantsSchema({
      user_id: my_id,
      room_id: room._id.toString(),
    });

    //Add participants to the room
    const participant2 = new ParticipantsSchema({
      user_id: friend_id,
      room_id: room._id.toString(),
    });

    //Save participants
    await participant.save();
    await participant2.save();

    res.json({
      message: "Room created successfully",
      status: "success",
      room_id: room._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create participants" });
  }
});

//Delete Room
router.delete("/:id", async (req, res) => {
  try {
    const participants = await ParticipantsSchema.findByIdAndDelete(
      req.params.id
    );
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete room" });
  }
});

module.exports = router;

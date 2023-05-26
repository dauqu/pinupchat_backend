const express = require("express");
const router = express.Router();
const ContactsSchema = require("../schema/contacts_schema");
const UsersSchema = require("../schema/user_schema");
const CheckAuth = require("../functions/check_auth");
const RoomSchema = require("./../schema/room_schema");

// GET all contacts
router.post("/", async (req, res) => {
  const friend_id = req.body.friend;
  const room_id = req.body.room_id;

  //Return if friend is not provided
  if (!friend_id && !room_id) {
    return res.json({ message: "All Field is not provided", status: "failed" });
  }

  // Check if room exists
  try {
    const room = await RoomSchema.findById(room_id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the room" });
  }

  const auth = await CheckAuth(req, res);
  if (auth.auth === false) {
    return res.status(401).json({ message: "Unauthorized", auth: false });
  }

  const participants = [auth.data._id, friend_id];
  try {
    //Check if already exists
    const check = await ContactsSchema.find({
      participants: { $all: participants },
    });

    //Check if both participants are the same
    if (participants[0] === participants[1]) {
      return res.json({
        message: "You cannot create a room with yourself",
        status: "success",
      });
    }

    if (check.length > 0) {
      return res.json({ message: "Room already exists", status: "success" });
    }

    //Add data
    const msg = new ContactsSchema({
      participants: participants,
      room: req.body.room_id,
    });

    await msg.save();

    res.json({ message: "Message was sent successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve contacts" });
  }
});

// GET rooms for the current user
router.get("/mine", async (req, res) => {
  const check = await CheckAuth(req, res);
  if (check.auth === false) {
    return res.status(401).json({ message: "Unauthorized", auth: false });
  }

  //Convert opject id to string
  const myid = check.data._id.toString();

  try {
    //Find wherer participants
    const msg = await ContactsSchema.find({
      participants: { $in: [myid] },
    }).populate({
      path: "participants",
      select: "-password -email -phone -role -rpt",
      match: { _id: { $ne: myid } },
    });

    res.json(msg);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve contacts" });
  }
});

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const rooms = await ContactsSchema.find().populate({
      path: "participants",
      select: "-password -email -phone -role -rpt",
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve contacts" });
  }
});

//Delete by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const msg = await ContactsSchema.findByIdAndDelete(id);
    res.json({
      message: "Message was deleted successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// GET all contacts
// router.get("/find/:id", async (req, res) => {
//   const { id } = req.params;

//   const myid = "6469eaf6e6f38eee5142f58f";

//   console.log(id);
//   try {
//     //Find wherer participants
//     const msg = await ContactsSchema.find({
//       participants: { $in: [id] },
//     }).populate({
//       path: "participants",
//       select: "-password -email -phone -role -rpt",
//       match: { _id: { $ne: myid } },
//     });

//     res.json(msg);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve contacts" });
//   }
// });

//Create One
// router.post("/", async (req, res) => {
//   const check = await CheckAuth(req, res);
//   if (check.auth === false) {
//     return res.status(401).json({ message: "Unauthorized", auth: false });
//   }

//   //Check if user exists
//   const user = await UsersSchema.findOne({ _id: req.body.participant_id });

//   if (!user) {
//     return res.status(404).json({ message: "User not found", status: "error" });
//   }

//   // Check if participant already exists in the room
//   const existingRoom = await ContactsSchema.findOne({
//     user_id: check.data._id,
//     participant_id: req.body.participant_id,
//   });

//   if (existingRoom) {
//     return res.status(400).json({
//       message: "Participant already exists in the room",
//       status: "error",
//     });
//   }

//   // const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
//   const msg = new ContactsSchema({
//     user_id: check.data._id,
//     participant_id: req.body.participant_id,
//   });
//   try {
//     await msg.save();
//     res
//       .status(201)
//       .json({ message: "Message was sent successfully", status: "success" });
//   } catch (error) {
//     res.status(500).json({ message: error.message, status: "error" });
//   }
// });

module.exports = router;

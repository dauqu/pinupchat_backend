const express = require("express");
const router = express.Router();
const CallSchema = require("../schema/call_schema");
const CheckAuth = require("./../functions/check_auth");
const UsersSchema = require("./../schema/user_schema");

module.exports = function (io) {
  // Route logic
  router.get("/", async (req, res) => {
    const calls = await CallSchema.find();
    res.json(calls);
  });

  //Get my calls where I am the caller or the receiver
  router.get("/my-calls", async (req, res) => {
    // Check Auth
    const auth = await CheckAuth(req, res);
    if (auth.auth === false) {
      return res
        .status(401)
        .json({ message: "Unauthorized", data: null, auth: false });
    }

    try {
      const calls = await CallSchema.find({
        $or: [{ call_from: auth.data._id }, { call_to: auth.data._id }],
      }).populate("call_from call_to", "full_name email dp");
      res.json(calls);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve calls" });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const call = await CallSchema.findById(req.params.id);
      if (!call) {
        return res.status(404).json({ message: "Call not found" });
      }
      res.json(call);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve call" });
    }
  });

  router.post("/", async (req, res) => {
    // Check Auth
    const auth = await CheckAuth(req, res);
    if (auth.auth === false) {
      return res
        .status(401)
        .json({ message: "Unauthorized", data: null, auth: false });
    }

    //Check if call to user exist
    const user = await UsersSchema.findById(req.body.call_to);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //You can't call yourself
    if (auth.data._id == req.body.call_to) {
      return res.status(400).json({ message: "You can't call yourself" });
    }

    const call = new CallSchema({
      type: req.body.type,
      call_from: auth.data._id,
      call_to: req.body.call_to,
    });

    try {
      //broadcast the call to the room
      io.to(req.body.room).emit("call", call);
      const newCall = await call.save();
      res.status(201).json(newCall);
    } catch (error) {
      res.status(400).json({ error: "Failed to create call" });
    }
  });

  router.patch("/:id", async (req, res) => {
    try {
      const call = await CallSchema.findById(req.params.id);
      if (!call) {
        return res.status(404).json({ message: "Call not found" });
      }
      const updatedCall = await call.updateOne({
        call_status: req.body.call_status,
        call_duration: req.body.call_duration,
      });
      res.json(updatedCall);
    } catch (error) {
      res.status(400).json({ error: "Failed to update call" });
    }
  });

  // // Handle socket connections
  io.on("connection", (socket) => {
    // Handle joining the room
    socket.on("join_room", (room) => {
      // Join the specified room
      socket.join(room);

      // Handle creating an event
      socket.on("create_event", (eventData) => {
        // Broadcast the event data to all connected clients in the room
        io.to(room).emit("event_created", eventData);
      });

      //Make Audio Call
      socket.on("make_audio_call", (data) => {
        io.to(room).emit("audio_call", data);
      });

      //End Audio Call
      socket.on("end_audio_call", (data) => {
        io.to(room).emit("end_audio_call", data);
      });

      //Make Video Call
      socket.on("make_video_call", (data) => {
        io.to(room).emit("video_call", data);
      });

      //End Video Call
      socket.on("end_video_call", (data) => {
        io.to(room).emit("end_video_call", data);
      });
    });
  });
  return router;
};

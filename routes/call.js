const express = require("express");
const router = express.Router();

module.exports = function (io) {
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

  // Route logic
  router.get("/", (req, res) => {
    res.json({ message: "QR Login route" });
  });

  return router;
};

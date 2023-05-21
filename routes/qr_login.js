const express = require("express");
const router = express.Router();
const CheckAuth = require("./../functions/check_auth");
const jwt = require("jsonwebtoken");

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
    });
  });

  // Route logic
  router.get("/", (req, res) => {
    res.json({ message: "QR Login route" });
  });

  return router;
};

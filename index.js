const express = require("express");
const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// Serve the HTML file
app.get("/", (req, res) => {
  //html file 
  res.sendFile(__dirname + "/home.html");
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected.");

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

// Start the server
http.listen(4000, () => {
  console.log(`Server listening on http://localhost:4000`);
});

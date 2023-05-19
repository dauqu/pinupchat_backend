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
  res.sendFile(__dirname + "/index.html");
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
http.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});

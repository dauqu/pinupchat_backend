const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Allow cors
const cors = require("cors");

// Array of allowed origins
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "https://admin-for-all.vercel.app",
  "https://pharmacy-hjmr.vercel.app",
];

// Set up cors options
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// Use cors middleware with options
app.use(cors(corsOptions));

// Serve the HTML file
app.get("/", (req, res) => {
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
const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

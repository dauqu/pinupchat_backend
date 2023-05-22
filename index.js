const express = require("express");
const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.use(express.json());

//Connect to database
const connectDB = require("./config/database");
connectDB();

//Allow cors
const cors = require("cors");
//Loop of allowed origins
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "https://admin-for-all.vercel.app",
  "https://dauqunews.vercel.app",
];

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Serve the HTML file
app.get("/", (req, res) => {
  //html file
  res.sendFile(__dirname + "/home.html");
});

const apiv1 = "/api/v1";

app.use("/api", require("./routes/qr_login")(io));

app.use(`${apiv1}/register`, require("./routes/register"));
app.use(`${apiv1}/login`, require("./routes/login"));
app.use(`${apiv1}/profile`, require("./routes/profile"));
app.use(`${apiv1}/rooms`, require("./routes/rooms"));
app.use(`${apiv1}/message`, require("./routes/message"));
app.use(`${apiv1}/users`, require("./routes/users"));

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

// Start the server
http.listen(4000, () => {
  console.log(`Server listening on http://localhost:4000`);
});

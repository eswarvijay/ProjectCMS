const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

/* =======================
   CORS
======================= */
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json());

/* =======================
   ROUTES
======================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

/* =======================
   SOCKET.IO
======================= */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

/* 🔥 MAKE IO AVAILABLE IN ROUTES */
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // Join complaint room
  socket.on("joinComplaint", (complaintId) => {
    const room = `complaint_${complaintId}`;
    socket.join(room);
    console.log(`👥 Joined room: ${room}`);
  });

  // Optional: leave room
  socket.on("leaveComplaint", (complaintId) => {
    socket.leave(`complaint_${complaintId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

/* =======================
   DB + SERVER
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(5000, () =>
      console.log("🚀 Server running on port 5000")
    );
  })
  .catch(console.error);

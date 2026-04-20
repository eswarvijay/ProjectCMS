const express = require("express");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET messages for a complaint (history)
 */
router.get("/:complaintId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      complaintId: req.params.complaintId
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to load messages");
  }
});

/**
 * POST new message (USER / AGENT / ADMIN)
 * ✔ Saves to DB
 * ✔ Emits via Socket.IO (REALTIME)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { complaintId, text } = req.body;

    if (!complaintId || !text) {
      return res.status(400).json("Invalid message data");
    }

    const message = new Message({
      complaintId,
      text,
      senderRole: req.user.role,
      senderName: req.user.name
    });

    await message.save();

    // 🔥 REAL-TIME EMIT (FIXED EVENT NAME)
    const io = req.app.get("io");

    if (io) {
      io.to(`complaint_${complaintId}`).emit("receiveMessage", message);
    }

    res.status(201).json(message);
  } catch (err) {
    console.error("Message error:", err);
    res.status(500).json("Message save failed");
  }
});

module.exports = router;
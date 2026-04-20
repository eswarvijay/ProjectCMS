const express = require("express");
const Complaint = require("../models/Complaint");
const { classifyComplaint, predictPriority } = require("../controllers/aiLogic");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

/* ===============================
   CREATE COMPLAINT (USER)
================================ */
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const category = classifyComplaint(req.body.description);
    const priority = predictPriority(req.body.description);

    const complaint = new Complaint({
      title: req.body.title,
      description: req.body.description,
      category,
      priority,
      userId: req.user.id
    });

    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json("Complaint creation failed");
  }
});

/* ===============================
   USER: GET OWN COMPLAINTS
================================ */
router.get("/", authMiddleware, async (req, res) => {
  res.set("Cache-Control", "no-store");
  const complaints = await Complaint.find({ userId: req.user.id });
  res.json(complaints);
});

/* ===============================
   ADMIN: GET ALL COMPLAINTS
================================ */
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const complaints = await Complaint.find()
        .populate("userId", "name email")
        .populate("assignedAgent", "name email")
        .sort({ createdAt: -1 });

      res.json(complaints);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ===============================
   ADMIN: UPDATE STATUS
================================ */
router.put(
  "/admin/update-status/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id).populate(
      "userId",
      "email name"
    );

    if (!complaint) {
      return res.status(404).json("Complaint not found");
    }

    complaint.status = status;

    // ✅ STEP-1 FIX (IMPORTANT)
    if (status === "Resolved") {
      complaint.resolvedAt = new Date();
    } else {
      complaint.resolvedAt = undefined; // 🔥 CLEAR when reopened
    }

    await complaint.save();

    sendEmail(
      complaint.userId.email,
      "Complaint Status Updated",
      `Hello ${complaint.userId.name},

Your complaint titled "${complaint.title}" is now marked as: ${status}.

Thank you,
Support Team`
    );

    res.json(complaint);
  }
);

/* ===============================
   ADMIN: ASSIGN AGENT
================================ */
router.put(
  "/admin/assign-agent/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { agentId } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedAgent: agentId },
      { new: true }
    );

    res.json(complaint);
  }
);

/* ===============================
   AGENT: GET ASSIGNED COMPLAINTS
================================ */
router.get(
  "/agent/my",
  authMiddleware,
  async (req, res) => {
    if (req.user.role !== "agent") {
      return res.status(403).json("Agent access only");
    }

    const complaints = await Complaint.find({
      assignedAgent: req.user._id
    }).populate("userId", "name email");

    res.json(complaints);
  }
);

/* ===============================
   AGENT: UPDATE STATUS
================================ */
router.put(
  "/agent/update-status/:id",
  authMiddleware,
  async (req, res) => {
    if (req.user.role !== "agent") {
      return res.status(403).json("Agent access only");
    }

    const { status } = req.body;

    const complaint = await Complaint.findOne({
      _id: req.params.id,
      assignedAgent: req.user._id
    }).populate("userId", "email name");

    if (!complaint) {
      return res.status(403).json("Not authorized");
    }

    complaint.status = status;

    // ✅ STEP-1 FIX (IMPORTANT)
    if (status === "Resolved") {
      complaint.resolvedAt = new Date();
    } else {
      complaint.resolvedAt = undefined; // 🔥 CLEAR when reopened
    }

    await complaint.save();

    sendEmail(
      complaint.userId.email,
      "Complaint Status Updated",
      `Hello ${complaint.userId.name},

Your complaint "${complaint.title}" is now: ${status}

Regards,
Support Team`
    );

    res.json(complaint);
  }
);

module.exports = router;

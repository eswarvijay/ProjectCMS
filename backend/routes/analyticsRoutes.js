const express = require("express");
const Complaint = require("../models/Complaint");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    /* ===============================
       TOTAL COMPLAINTS
    =============================== */
    const totalComplaints = await Complaint.countDocuments();

    /* ===============================
       BY CATEGORY
    =============================== */
    const byCategory = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    /* ===============================
       BY PRIORITY
    =============================== */
    const byPriority = await Complaint.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    /* ===============================
       BY STATUS
    =============================== */
    const byStatus = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    /* ===============================
       AGENT PERFORMANCE
    =============================== */
    const agentPerformance = await Complaint.aggregate([
      { $match: { assignedAgent: { $ne: null } } },
      {
        $group: {
          _id: "$assignedAgent",
          totalAssigned: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "agent"
        }
      },
      { $unwind: "$agent" },
      {
        $project: {
          _id: "$agent.name",
          totalAssigned: 1,
          resolved: 1
        }
      }
    ]);

    /* ===============================
       ⭐ AVG RESOLUTION TIME (STEP-2 FIX)
    =============================== */
    const avgResolutionAgg = await Complaint.aggregate([
      {
        $match: {
          status: "Resolved",
          resolvedAt: { $exists: true },
          createdAt: { $exists: true }
        }
      },
      {
        $project: {
          durationMs: { $subtract: ["$resolvedAt", "$createdAt"] }
        }
      },
      {
        $match: {
          durationMs: { $gt: 0 } // 🔥 ignore invalid data
        }
      },
      {
        $group: {
          _id: null,
          avgDurationMs: { $avg: "$durationMs" }
        }
      }
    ]);

    const avgResolutionTime =
      avgResolutionAgg.length > 0
        ? avgResolutionAgg[0].avgDurationMs / (1000 * 60 * 60)
        : 0;

    /* ===============================
       📈 WEEKLY TREND
    =============================== */
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);

    const weeklyTrendRaw = await Complaint.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          complaints: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0]
            }
          }
        }
      }
    ]);

    const dayMap = {
      1: "Sun",
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thu",
      6: "Fri",
      7: "Sat"
    };

    const weeklyTrend = weeklyTrendRaw.map(d => ({
      day: dayMap[d._id],
      complaints: d.complaints,
      resolved: d.resolved
    }));

    /* ===============================
       FINAL RESPONSE
    =============================== */
    res.json({
      totalComplaints,
      byCategory,
      byPriority,
      byStatus,
      agentPerformance,
      avgResolutionTime,
      weeklyTrend
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analytics fetch failed" });
  }
});

module.exports = router;

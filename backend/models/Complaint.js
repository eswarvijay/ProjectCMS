const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    priority: String,

    status: {
      type: String,
      default: "Open",
    },

    // ✅ MUST EXIST (THIS WAS THE ISSUE)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ agent reference
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    resolvedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);

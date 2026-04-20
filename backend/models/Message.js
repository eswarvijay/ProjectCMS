const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true
    },

    senderRole: {
      type: String,
      enum: ["user", "agent", "admin"],
      required: true
    },

    senderName: {
      type: String,
      required: true
    },

    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
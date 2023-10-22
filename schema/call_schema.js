const mongoose = require("mongoose");

// Schema
const CallSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["audio", "video"],
    },
    call_from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    call_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    call_status: {
      type: String,
      enum: ["Answered", "Missed", "Rejected", "Busy"],
    },
    call_duration: {
      type: String,
      default: "00:00:00",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("calls", CallSchema);

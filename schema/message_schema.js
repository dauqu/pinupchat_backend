const mongoose = require("mongoose");

// Schema
const MessageSchema = new mongoose.Schema(
  {
    attachments: {
      type: Array,
      default: [],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    parant_message: {
      type: mongoose.Schema.ObjectId,
      ref: "chat",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("messages", MessageSchema);

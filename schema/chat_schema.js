const mongoose = require("mongoose");

// Schema
const GroupeSchema = new mongoose.Schema(
  {
    attachments: {
      type: Array,
      default: [],
    },
    sender_id: {
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
    parant_message_id: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chat", GroupeSchema);

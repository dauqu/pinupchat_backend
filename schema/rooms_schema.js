const mongoose = require("mongoose");

// Schema
const RoomSchema = new mongoose.Schema(
  {
    room_type: {
      type: String,
      required: true,
      default: "single",
    },
    user_id: {
      type: String,
      required: true,
    },
    participant_id: {
      type: String,
      required: true,
      ref: "users",
    },
    archived: {
      type: Boolean,
      required: true,
      default: false,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    blocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    muted: {
      type: Boolean,
      required: true,
      default: false,
    },
    last_message: {
      // Type will dynamic be changed to message
      type: String,
      required: true,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("rooms", RoomSchema);

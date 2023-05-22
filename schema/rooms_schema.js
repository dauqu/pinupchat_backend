const mongoose = require("mongoose");

// Schema
const RoomSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
    },
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("rooms", RoomSchema);

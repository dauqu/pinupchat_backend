const mongoose = require("mongoose");

// Schema
const ParticipantsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("participants", ParticipantsSchema);

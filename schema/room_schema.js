const mongoose = require("mongoose");

// Schema
const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    groupe_id: {
      type: String,
    },
    last_message: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("room", RoomSchema);

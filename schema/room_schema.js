const mongoose = require("mongoose");

// Schema
const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
    },
    type: {
      type: String,
      required: true,
      default: "private",
      enum: ["private", "public"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("room", RoomSchema);

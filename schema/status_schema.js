const mongoose = require("mongoose");

// Schema
const StatusSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    status_data: {
      type: String,
      required: true,
      default: "",
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("status", StatusSchema);

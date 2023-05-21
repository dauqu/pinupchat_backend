const mongoose = require("mongoose");

//Schema
const StatusSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content_type: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    seen_by: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("status", StatusSchema);

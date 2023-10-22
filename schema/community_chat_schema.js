const mongoose = require("mongoose");

// Schema
const CommunityChatSchema = new mongoose.Schema(
  {
    attachments: {
      type: Array,
      default: [],
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "community",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    parant_message: {
      type: mongoose.Schema.ObjectId,
      ref: "communitychatchema",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("communitychatchema", CommunityChatSchema);

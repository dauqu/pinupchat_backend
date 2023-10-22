const mongoose = require("mongoose");

// Schema
const CommunitySchema = new mongoose.Schema(
  {
    participants: {
      type: Array,
      required: true,
      ref: "users",
    },
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: "",
    },
    admin: {
      type: String,
      required: true,
      ref: "users",
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

module.exports = mongoose.model("community", CommunitySchema);

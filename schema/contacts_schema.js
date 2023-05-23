const mongoose = require("mongoose");

// Schema
const ContactsSchema = new mongoose.Schema(
  {
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
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("contacts", ContactsSchema);

const mongoose = require("mongoose");

// Schema
const ContactsSchema = new mongoose.Schema(
  {
    participants: {
      type: Array,
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

module.exports = mongoose.model("contacts", ContactsSchema);

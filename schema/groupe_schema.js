const mongoose = require("mongoose");

// Schema
const GroupeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    participants: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("group", GroupeSchema);

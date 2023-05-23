const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chat_room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    content_type: {
      type: String,
      required: true, 
      enum: ["text", "image", "video", "audio", "file"],
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", MessageSchema);

const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null,
  },
  video: {
    type: String,
    default: null,
  },
  audio: {
    type: String,
    default: null,
  },
  attachments: {
    type: String,
    default: null,
  },
  polls: {
    type: Array,
    default: [],
  },
});

const PrivateChatSchema = new mongoose.Schema(
  {
    attachments: {},
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "text",
      enum: ["text", "image", "video", "audio", "attachments", "pools"],
    },
    message: {
      type: MessageSchema,
      required: true,
    },
    parant_message_id: {
      type: String,
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    delete_from: {
      type: String,
      enum: ["me", "everywhere", null],
      default: null,
    },
    delete_by: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("private_chat", PrivateChatSchema);

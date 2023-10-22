const express = require("express");
const router = express.Router();
const CommunityChatSchema = require("../schema/community_chat_schema");
const CheckAuth = require("../functions/check_auth");
const CommunitySchema = require("../schema/community_schema");

//Get community chat
router.get("/", async (req, res) => {
  try {
    const community_chat = await CommunityChatSchema.find();
    res.json(community_chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve community chat" });
  }
});

//Get community chat by id
router.get("/:community", async (req, res) => {
  try {
    const community_chats = await CommunityChatSchema.find({
      community: req.params.community,
    });
    res.json(community_chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve community chat" });
  }
});

//Post a community chat
router.post("/", async (req, res) => {
  // Check Auth first
  const check = await CheckAuth(req, res);
  if (check.auth === false) {
    return res
      .status(401)
      .json({ message: "Unauthorized", data: null, auth: false });
  }

  if (!req.body.community_id) {
    return res
      .status(400)
      .json({ message: "Community ID is required", data: null, auth: true });
  }

  // Check if community exists
  try {
    const community = await CommunitySchema.findById(req.body.community_id);
    if (!community) {
      return res
        .status(404)
        .json({ message: "Community not found", data: null, auth: true });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", data: null, auth: true });
  }

  // Create a new community chat
  const community_chat = new CommunityChatSchema({
    attachments: req.body.attachments,
    community: req.body.community_id,
    message: req.body.message,
    sender: check.data._id,
  });

  try {
    const saved_community_chat = await community_chat.save();
    res.json(saved_community_chat);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Delete a community chat
router.delete("/:id", async (req, res) => {
  // Check Auth first
  const check = await CheckAuth(req, res);
  if (check.auth === false) {
    return res
      .status(401)
      .json({ message: "Unauthorized", data: null, auth: false });
  }

  // Check if community chat exists
  try {
    const community_chat = await CommunityChatSchema.findById(req.params.id);
    if (!community_chat) {
      return res
        .status(404)
        .json({ message: "Community chat not found", data: null, auth: true });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", data: null, auth: true });
  }

  // Delete community chat
  try {
    const deleted_community_chat = await CommunityChatSchema.deleteOne({
      _id: req.params.id,
    });
    res.json(deleted_community_chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete community chat" });
  }
});

module.exports = router;

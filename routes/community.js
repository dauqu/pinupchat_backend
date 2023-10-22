const express = require("express");
const router = express.Router();
const CommunitySchema = require("../schema/community_schema");
const CheckAuth = require("./../functions/check_auth");

//Get community
router.get("/", async (req, res) => {
  try {
    const community = await CommunitySchema.find();
    res.json(community);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve community" });
  }
});

//Get community by id
router.get("/:id", async (req, res) => {
  try {
    const community = await CommunitySchema.findById(req.params.id);
    res.json(community);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve community" });
  }
});

//get community where admin is my id
router.get("/my", async (req, res) => {
  // Check Auth first
  const check = await CheckAuth(req, res);
  if (check.auth === false) {
    return res
      .status(401)
      .json({ message: "Unauthorized", data: null, auth: false });
  }

  try {
    const community = await CommunitySchema.find({
      admin: check.data._id,
    });
    res.json(community);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve community" });
  }
});

//Post a community
router.post("/", async (req, res) => {
  // Check Auth first
  const check = await CheckAuth(req, res);
  if (check.auth === false) {
    return res
      .status(401)
      .json({ message: "Unauthorized", data: null, auth: false });
  }

  if (!req.body.name) {
    return res
      .status(400)
      .json({ message: "Name is required", data: null, auth: true });
  }

  if (!req.body.username) {
    return res
      .status(400)
      .json({ message: "Username is required", data: null, auth: true });
  }

  //Check if username is already taken
  // Check if username is already taken
  const username = await CommunitySchema.findOne({
    username: req.body.username,
  });

  if (username) {
    return res
      .status(400)
      .json({ message: "Username already taken", data: null, auth: true });
  }

  const community = new CommunitySchema({
    participants: req.body.participants,
    name: req.body.name,
    logo: req.body.logo,
    username: req.body.username,
    admin: check.data._id,
    last_message: req.body.last_message,
  });

  try {
    const savedCommunity = await community.save();
    res.json(savedCommunity);
  } catch (error) {
    res.status(500).json({ error: "Failed to save community" });
  }
});

//Update a community
router.patch("/:id", async (req, res) => {
  try {
    const community = await CommunitySchema.findById(req.params.id);
    community.participants = req.body.participants;
    community.name = req.body.name;
    community.logo = req.body.logo;
    community.admin = req.body.admin;
    community.last_message = req.body.last_message;
    const savedCommunity = await community.save();
    res.json(savedCommunity);
  } catch (error) {
    res.status(500).json({ error: "Failed to update community" });
  }
});

//Delete a community
router.delete("/:id", async (req, res) => {
  try {
    const community = await CommunitySchema.findByIdAndDelete(req.params.id);
    res.json(community);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete community" });
  }
});

module.exports = router;

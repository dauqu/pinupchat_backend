const express = require("express");
const router = express.Router();
const ParticipantsSchema = require("./../schema/participants_schema");
const CheckAuth = require("./../functions/check_auth");

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const participants = await ParticipantsSchema.find();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve participants" });
  }
});

//Get participants where mine
router.get("/mine", async (req, res) => {
  const auth = await CheckAuth(req, res);

  try {
    const participants = await ParticipantsSchema.find({
      user_id: auth.data._id,
    }).populate({
      path: "user_id",
      select: "-password -email -phone -role -rpt",
    });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve participants" });
  }
});

//Post a room
router.post("/", async (req, res) => {
  try {
    const participants = await ParticipantsSchema.create({
      room_id: req.body.room_id,
      user_id: req.body.user_id,
    });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: "Failed to create participants" });
  }
});

//Delete Room
router.delete("/:id", async (req, res) => {
  try {
    const participants = await ParticipantsSchema.findByIdAndDelete(
      req.params.id
    );
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete room" });
  }
});

module.exports = router;

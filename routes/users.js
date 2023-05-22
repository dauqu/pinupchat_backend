const express = require("express");
const router = express.Router();
const UsersSchema = require("./../schema/user_schema");

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const users = await UsersSchema.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve contacts" });
  }
});

module.exports = router;

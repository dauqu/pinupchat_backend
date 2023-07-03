const express = require("express");
const router = express.Router();
const StatusSchema = require("./../schema/status_schema");
const fs = require("fs");
const CheckAuth = require("./../functions/check_auth");

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const status = await StatusSchema.find();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve status" });
  }
});

//Post a room
router.post("/", async (req, res) => {

  const check = await CheckAuth(req, res);
  if (check.auth === false) {
    return res
      .status(401)
      .json({ message: "Unauthorized", data: null, auth: false });
  }

  //CHeck if file is not uploaded
  if (!req.files) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  //Get file
  const file = req.files.status_data;

  //Rename file
  const fileName = `${Date.now()}-${file.name}`;

  //Move file to public folder
  file.mv(`./files/${fileName}`, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
  });

  try {
    const status = await StatusSchema({
      user_id: check.auth._id,
      content_type: req.body.content_type,
      content: fileName,
      seen_by: [],
    });
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Failed to create room" });
  }
});

//Delete Room
router.delete("/:id", async (req, res) => {
  try {
    const chat = await StatusSchema.findByIdAndDelete(req.params.id);
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete room" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const MessageSchema = require("../schema/message_schema");
const CheckAuth = require("./../functions/check_auth");

module.exports = function (io) {
  // GET all mesages
  router.get("/", async (req, res) => {
    try {
      // const message = await MessageSchema.find().populate({
      //   path: "sender_id",
      //   select: "-password -email -phone -role -rpt",
      // });
      const message = await MessageSchema.find();
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve contacts" });
    }
  });

  router.get("/:room", async (req, res) => {
    try {
      const message = await MessageSchema.find({
        room_id: req.params.room,
      });
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve contacts" });
    }
  });

  //Create One
  router.post("/", async (req, res) => {
    const roomId = req.body.room;

    const check = await CheckAuth(req, res);
    if (check.auth === false) {
      return res.status(401).json({ message: "Unauthorized", auth: false });
    }

    // const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    const msg = new MessageSchema({
      attachments: req.body.attachments,
      sender: check.data._id,
      room_id: roomId,
      message: req.body.message,
      parant_message_id: req.body.parant_message_id,
    });
    try {
      await msg.save();
      res
        .status(201)
        .json({ message: "Message was sent successfully", status: "success" });

      //Emmit to room
      io.to(check.data._id).emit("new_message", msg);
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  });

  //Delete One
  router.delete("/:id", async (req, res) => {
    try {
      await MessageSchema.deleteOne({ _id: req.params.id });
      res.json({ message: "Message deleted successfully", status: "success" });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  });

  return router;
};

const express = require("express");
const router = express.Router();
require("dotenv").config();
var fs = require("fs");
const path = require("path");
require("dotenv").config();
const JWT = require("jsonwebtoken");
const User_Model = require("./../models/users_schema");

//Upload File
router.post("/", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: "error",
        message: "Error: No file uploaded",
      });
    } else {
      // Send File on Location
      const uploadedFile = req.files.uploadedFile;
      uploadedFile.mv("./files/" + uploadedFile.name);

      res.setHeader("Authorization", req.cookies.token);

      // Send Response with header
      res.send({
        status: "success",
        message: "File successfully uploaded",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "error.message" });
  }
});

//Get File directly
router.get("/dir", (req, res) => {
  res.json({ files_Path: "https://news.dauqu.com" + "/" });
});

//Static file
router.use("/", express.static("files"));

//Get All files
router.get("/uploaded_files", (req, res) => {
  try {
    const directoryPath = path.join(__dirname, "../files");

    fs.readdir(directoryPath, function (err, files) {
      res.send(
        files.map((file) => {
          return {
            id: Buffer.from(file).toString("base64"),
            name: file,
            path: "https://news.dauqu.com" + "/" + file,
            size: fs.statSync(path.join(directoryPath, file)).size,
            file_extension: path.extname(file),
            date: fs.statSync(path.join(directoryPath, file)).mtime,
          };
        })
      );
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Delete files
router.post("/delete", delete_file, (req, res) => {
  try {
    const name = req.body.name;
    const directoryPath = path.join(__dirname, "../files");
    fs.unlink(`${directoryPath}/${name}`, (error) => {
      if (error) {
        res.status(500).json({ message: error.message, status: "error" });
      }
    });
    res.send({
      status: "success",
      message: "File successfully deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Middleware for upload files
async function upload_file(req, res, next) {
  try {
    const decoded = JWT.verify(req.cookies.token, process.env.JWT_SECRET);
    const user = await User_Model.findById(decoded.id);
    //Check if user is logged in
    if (req.cookies.token === undefined) {
      return res.status(401).json({
        message: "You are not logged in",
        status: "warning",
      });
    }

    //CHeck if user is admin
    if (user.role !== "admin") {
      return res.status(401).json({
        message: "You are not authorized to upload files",
        status: "warning",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
}

//Middleware for dlete files
async function delete_file(req, res, next) {
  //Check user have token or not
  const token = req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

  try {
    //Check if user is logged in
    if (token === undefined || token === null || token === "") {
      return res.status(401).json({
        message: "You are not logged in",
        status: "warning",
      });
    }

    //Check if user is admin
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    //Get id from token
    const id = decoded.id;
    //Get user role by id
    const user = await User_Model.findById(id);
    if (user.role !== "admin") {
      return res.status(401).json({
        message: "You are not authorized to delete files",
        status: "warning",
      });
    }

    //Check if file exists
    const name = req.body.name;
    const directoryPath = path.join(__dirname, "../files");

    if (!fs.existsSync(`${directoryPath}/${name}`)) {
      res.status(404).json({ message: "File not found", status: "error" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
}

module.exports = router;
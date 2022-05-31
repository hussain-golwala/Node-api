var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
var authentication = require("../middleware/authentication");
const { token } = require("morgan");
const { response, json } = require("express");
const { route } = require(".");

const multer = require("multer");
const users = require("../models/users");
const mongoose = require("mongoose");
const app = require("../app");
const { updateMany } = require("../models/users");
const User = mongoose.model("user");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // console.log('~file', file);

    const filename = Date.now();
    cb(null, filename + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Create new user
router.post('/create', upload.any("uploadedFile"),
  async function (req, res, next) {
    try {
      const user = req.body;
      const hash = await generateHash(user.password);
      user.password = hash;
      user.profile_pic = req.files[0].path;

      User.create(user).then((result) => {
        return res.status(200).json({
          success: true,
          error: false,
          data: result,
          msg: "User created successfully",
        });
      });
    } catch {
      return res.status(500).json({
        success: false,
        error: true,
        data: [],
        msg: "Error while creating user",
      });
    }
  }
);
async function generateHash(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
}

//  list of users
router.get('/list', authentication, function (req, res) {
  const user = req.body;
  User.find(user)
    .then((result) => {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        msg: "Users fetched Successfully",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        error: true,
        data: [],
        msg: "Error while fetching users",
      });
    });
});


// Update the data using user id
router.put("update/:id", authentication, function (req, res) {
  const user = req.body;
  const id = req.params.id;
  user.password = hash;
  user.profile_pic = req.files[0].path;
  User.findOneAndUpdate({ _id: id }, user)
    .then((result) => {
      console.log(result);
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        msg: "User updated successfully",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        error: true,
        data: [],
        msg: "Error while updating user",
      });
    });
});
async function generateHash(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
}

//hard delete the user by user _id

router.get("/delete/:id", authentication, function (req, res) {
  const user = req.body;
  User.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(200).json({
        success: true,
        error: false,
        data: result,
        msg: "User Deleted Successfully ",
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: true,
        data: [],
        msg: "Error while deleting user",
      });
    });
});

// Login using the user username and Password

router.post("/login", function (req, res) {
  const user = req.body;
  let username = user.username;
  User.findOne({ username: username })
    .then((result) => {
      const flag = bcrypt.compareSync(user.password, result.password);
      if (flag) {
        var token = jwt.sign({ username: result.username }, "my_secret", {
          expiresIn: "1h",
        });
        return res.status(200).json({
          success: true,
          error: false,
          data: user,
          token,
          msg: "Logged in Successfully ",
        });
      } else {
        res.status(404).json({
          success: false,
          error: true,
          msg: "invalid Credentials",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: true,
        data: [],
        msg: "Error while login the user ",
      });
    });
});

module.exports = router;

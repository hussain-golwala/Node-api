var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
var authentication = require("../middleware/authentication");
const { token } = require("morgan");
const { response, json } = require("express");
const { route } = require(".");
const { sequelize } = require("../models");

const multer = require("multer");
const users = require("../models/users");

// For Storage of Data using Multer

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

// Get List of all users data  🚀
router.get("/list", authentication, async function (req, res, next) {
  try {
    const user = await models.user.findAll({
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "username",
        "password",
        "phone_number",
        "company",
        "profile_pic"
      ],
    });
    
    return res.status(200).json({
      success: true,
      error: false,
      data: user,
      msg: "User's Fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      data: [],
      msg: "Error while fetching user's",
    });
  }
});



// Create user  🚀
router.post("/create", authentication, upload.any("uploadedFile"),
  async function (req, res) {
    try {
      const user = req.body;
      const hash = await generateHash(user.password);
      user.password = hash;
      user.profile_pic = req.files[0].path;
      const result = await models.user.create(user);
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        msg: "User Created Successfully",
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

// login here 🚀
router.post("/login", async function (req, res) {
  try {
    const user = req.body;
    const result = await models.user.findAll({
      attributes: ["password"],
      where: { username: user.username },
    });
    var token = jwt.sign(
      {
        username: result[0].username,
      },
      "my_secret",
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      token: token,
      msg: "User login Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: true,
      data: [],
      msg: "Error while login user",
    });
  }
});

// hard delete 🚀
router.delete("/hard/:id", authentication, async function (req, res) {
  try {
    const id = req.params.id;
    const user = req.body;
    const result = await models.user.destroy(user, {
      where: {
        id: user,
        id,
      },
    });
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      msg: "User deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: true,
      data: [],
      msg: "Error while deleting user",
    });
  }
});

// Put user data

// first_name: user.first_name,
// last_name: user.last_name,
router.put(
  "/update1/:id",
  upload.any("uploadedFile"),
  async function (req, res) {
    const user = req.body;
    const id = req.params.id;
    console.log(user);
    const result = await models.user
      .update(
        user,
           {
          where: {
            id,
          },
        }
      )
      .then((result) => {
        console.log(result);
        res.status(200).json({
          success: true,
          error: false,
          data: result,
          msg: "Users update successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          error: true,
          data: [],
          msg: "Error while updating the user",
        });
      });
  }
);

router.put(
  "/update/:id",
  upload.any("uploadedFile"),
  async function (req, res) {
    try {
      const user = req.body;
      const id = req.params.id;
      const hash = await generateHash(user.password);
      user.password = hash;
      user.profile_pic = req.files[0].path;
      const result = await models.user.update(user, {
        where: {
          id: user.id,
        },
      });
      console.log("result : ", result);
      if (result) {
        return res.status(200).json({
          success: true,
          error: false,
          data: result,
          msg: "User updated Successfully",
        });
      } else {
        return res.status(500).json({
          success: false,
          error: true,
          data: [],
          msg: "please check user id",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: true,
        data: err,
        msg: "Error while updating the user",
      });
    }
  }
);

module.exports = router;

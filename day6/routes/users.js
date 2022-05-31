var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
var authentication = require('../middleware/authentication');
const { token } = require('morgan');
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/");
  },
  filename: function (req, file, cb) {
    const filename = Date.now();
    cb(null, filename + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/
// GET user list
router.get("/list", async function (req, res, next) {
  try {
    const result = await getUserData();
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      msg: "data Fetched Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      data: [],
      msg: "Error in fetching the user details",
    });
  }
});

async function getUserData() {
  return new Promise((resolve, reject) => {
    con.query('SELECT id, first_name, last_name, profile_pic FROM user  WHERE is_deleted = 0',
      function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
}

// Register User 
router.post("/create", upload.any("uploaded_file"), async function (req, res) {
  try {
    const user = req.body;
    console.log("User : ", user);
    const hash = await generateHash(user.password);
    user.password = hash;
    profile_pic = req.files[0].path;
    console.log("profile_pic : ", profile_pic);
    const result = await createUser(user, profile_pic);

    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      msg: "User created Successfully",
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: true,
      data: [],
      msg: "Error while creating User",
    });
  }
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
async function createUser(user, profile_pic) {
  console.log("User...", user);
  return new Promise((resolve, reject) => {
    console.log("profile_pic : ", profile_pic);
    con.query('INSERT INTO user(first_name, last_name, email, username, password, phone_number, company, profile_pic) VALUES (?,?,?,?,?,?,?,?)',
      [user.first_name, user.last_name, user.email, user.username, user.password, user.phone_number, user.company, profile_pic
      ],
      function (err, result) {
        console.log(this.sql);
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
} 
// Update User
router.put("/update/:id",upload.any("uploaded_file"), async function (req, res) {
  try {
    const user = req.body;
    const id = req.params.id;
    profile_pic = req.files[0].path;
    console.log("profile_pic : ", profile_pic);
    const result = await updateUser(user, id,profile_pic);
    return res.status(200).json({
      success: true,
      Error: false,
      data: result,
      msg: "User updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      data: [],
      msg: "Error while updating user",
    });
  }
});

async function updateUser(user, id, profile_pic) {
  return new Promise((resolve, reject) => {
    con.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, username = ?, password = ?, phone_number = ?, company = ?, profile_pic = ? WHERE id = ?',
      [user.first_name, user.last_name, user.email, user.username, user.password, user.phone_number, user.company, profile_pic, id
      ],
      function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
}

// Login User
router.post("/login", async function (req, res) {
  try {
    const user = req.body;
    const output = await loginUser(user);

    return res.status(200).json({
      success: true,
      error: false,
      data: output,
      token: token,
      msg: " User Login Successful",
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: true,
      data: [],
      msg: "Login Failed",
    });
  }
});
async function loginUser(user) {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT username , password FROM user WHERE username = ? OR email = ?",
      [user.username, user.email],
      function (err, output) {
        if (err) {
          return err;
        }
        console.log(user.password, output[0].password);
        bcrypt.compare(
          user.password,
          output[0].password,

          function (error, rest) {
            var token = jwt.sign(
              { username: output[0].username },
              "secret_key",
              { expiresIn: "3h" }
            );

            console.log("token", token);

            if (err) {
              reject(err);
            }
            resolve(output);
          }
        );
      }
    );
  });
}

module.exports = router;

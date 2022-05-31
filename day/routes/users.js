var express = require("express");
const { route } = require(".");
var router = express.Router();
const multer = require("multer");
const bcrypt = require("bcryptjs");
const saltRounds = 3;
var jwt = require("jsonwebtoken");
var authentication = require("../authentication");
const { query } = require("express");
const secret = "!@#%^$&&*()";

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
// get data from api
router.get("/list", authentication, async function (req, res, next) {
  try {
    const users = req.body;
    const result = await models.users.findAll(users);
    console.log(result);
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      msg: "Data Fetch Successfully",
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: true,
      data: [],
      msg: "Error while fetching data",
    });
  }
});
// async function getUser(users) {
//   return new Promise((resolve, reject) => {
//     con.query(
//       "SELECT id, first_name, last_name, username, email, password,phone_number,company FROM users WHERE is_deleted = 0;",
//       function (err, result) {
//         if (err) {
//           console.log("test");
//           reject(err);
//         }
//         resolve(result);
//       }
//     );
//   });
// }

// create data in api
router.post("/create", upload.any("uploadedFile"), async function (req, res) {
  try {
    const users = req.body;
    const hash = await generateHash(users.password);
    users.password = hash;
    users.profile_pic = req.files[0].path;
    const result = await models.users.create(users);
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
// async function insertUser(users) {
//   return new Promise((resolve, reject) => {
//     con.query(
//       `INSERT INTO users (first_name, last_name, username, email, password,profile_pic, phone_number,company)
//       VALUES ('${users.first_name}', '${users.last_name}', '${users.username}', '${users.email}', '${users.password}', '${users.profile_pic}','${users.phone_number}','${users.company}')`,
//       function (err, result) {
//         if (err) {
//           console.log("test");
//           reject(err);
//         }
//         resolve(result);
//       }
//     );
//   });
// }

// Update data using PUT
router.put(
  "/update/:id",
  authentication,
  upload.any("uploadedFile"),
  async function (req, res) {
    try {
      const users = req.body;
      const id = req.params.id;
      const hash = await generateHash(users.password);
      users.password = hash;
      users.profile_pic = req.files[0].path;
      const result = await models.users.update(users, {
        where: {
          id,
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
        msg: "Error while updating user",
      });
    }
  }
);

// async function updateUser(users, id) {
//   return new Promise((resolve, reject) => {
//     con.query(
//       "UPDATE users SET first_name = ?, last_name = ?, username = ?,  email = ?, profile_pic = ?, phone_number  = ?,  company = ? WHERE id = ?",
//       [
//         users.first_name,
//         users.last_name,
//         users.username,
//         users.email,
//         users.profile_pic,
//         users.phone_number,
//         users.company,
//         id,
//       ],
//       function (err, result) {
//         if (err) {
//           reject(err);
//         }
//         resolve(result);
//       }
//     );
//   });
// }

// soft and hard delete of data.

router.delete("/hard/:id", authentication, async function (req, res) {
  try {
    const id = req.params.id;
    const users = req.body;
    const result = await models.users.destroy({
      where: {
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

// async function hardDeleteUser(users, id) {
//   return new Promise((resolve, reject) => {
//     con.query("DELETE FROM users WHERE id = ?", [id], function (err, result) {
//       if (err) {
//         reject(err);
//       }
//       resolve(result);
//     });
//   });
// }

// Register part
router.post(
  "/register",
  authentication,
  upload.single("uploadedFile"),
  async function (req, res) {
    try {
      const users = req.body;
      users.profile_pic = req.file.path;

      const hash = await generateHash(users.password);
      users.password = hash;
      const result = await models.users.create(users);
      console.log(result);
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        msg: "User registered Successfully",
      });
    } catch {
      return res.status(500).json({
        success: false,
        error: true,
        data: [],
        msg: "Error while register user",
      });
    }
  }
);

// async function registerUser(users) {
//   return new Promise((resolve, reject) => {
//     con.query(
//       `INSERT INTO users (first_name, last_name, username, email, password,phone_number,company)
//       VALUES ('${users.first_name}', '${users.last_name}', '${users.username}', '${users.email}', '${users.password}','${users.phone_number}','${users.company}')`,
//       function (err, result) {
//         if (err) {
//           console.log("test");
//           reject(err);
//         }
//         resolve(result);
//       }
//     );
//   });
// }

// login part
router.post("/login", async function (req, res) {
  try {
    const users = req.body;
    const result = await models.users.findAll({
      attributes: ["password"],
      where: { email: users.email },
    });
    var token = jwt.sign(
      {
        username: result[0].username,
      },
      secret,
      { expiresIn: "1h" }
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
// const getPassword = await models.users.findAll({
//   attributes : ['password'],where :{email}
//   });
// async function loginUser(users) {
//   return new Promise((resolve, reject) => {
//     con.query(
//       "SELECT username, email, password FROM users WHERE username=? OR email=?",
//       [users.username, users.email],
//       function (err, result) {
//         if (err) {
//           return err;
//         }
//         console.log(users.password, result[0].password);
//         bcrypt.compare(
//           users.password,
//           result[0].password,

//           function (error, rest) {
//             var token = jwt.sign(
//               {
//                 username: result[0].username,
//               },
//               secret,
//               { expiresIn: "1h" }
//             );
//             console.log("token", token);
//             if (err) {
//               reject(err);
//             }
//             resolve(result);
//           }
//         );
//       }
//     );
//   });
// }

// Get user list by ID
router.get("/list/:id", authentication, async function (req, res, next) {
  try {
    const users = req.body;
    var id = req.params.id;
    const result = await getUserById(users, id);
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      msg: "Data Fetch Successfully",
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: true,
      data: [],
      msg: "Error while fetching data",
    });
  }
});
async function getUserById(users, id) {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM users WHERE id = ?", [id], function (err, result) {
      if (err) {
        console.log("test");
        reject(err);
      }
      resolve(result);
    });
  });
}
module.exports = router;

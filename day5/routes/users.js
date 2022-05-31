var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
var jwt = require('jsonwebtoken');
var authentication = require('../middleware/authentication');
const { token } = require('morgan');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });



//GET users listing with select method
router.get("/list", async function (req, res, next) {
  try {
    const result = await getUserData();
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      msg: "Users Fetched Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      data: [],
      msg: "Error while fetching the users",
    });
  }
});

async function getUserData() {
  return new Promise((resolve, reject) => {
    con.query('SELECT id, first_name, last_name FROM user WHERE is_deleted = 0', function(err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    }
    );
  });
}


// registration method
router.post('/create', async function (req, res) {
  try {
    const user = req.body;
    const hash = await generateHash(user.password);
    user.password = hash;
    const result = await createUser(user);
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

async function createUser(user) {
  return new Promise((resolve, reject) => {
    con.query(`INSERT INTO user(first_name, last_name, email, username, password, phone_number, company) VALUES(?,?,?,?,?,?,?)`, [user.first_name, user.last_name,
      user.email, user.username, hash, user.phone_number, user.company
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

// Soft id delete method
router.delete("/soft/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const result = await softDelete(id);
    return res.status(200).json({
      success: true,
      Error: false,
      data: result,
      msg: "user deleted Successfully(Soft delete)",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      data: [],
      msg: "Error While deleting the user",
    });
  }
});

async function softDelete(id) {
  return new Promise((resolve, reject) => {
    con.query(
      "UPDATE user SET is_deleted= ? WHERE id=?",
      [1, id],
      function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
}



// Hard id delete method
router.delete("/hard/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const result = await hardDelete(id);

    return res.status(200).json({
      success: true,
      Error: false,
      data: result,
      msg: "user deleted Successfully(Hard delete)",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      data: [],
      msg: "Error While deleting the user",
    });
  }
});

async function hardDelete(id) {
  return new Promise((resolve, reject) => {
    con.query("DELETE FROM user WHERE id=?", [id], function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}



// Update data in database with update id method
router.put("/update/:id", async function (req, res) {
  try {
    const user = req.body;
    const id = req.params.id;
    const result = await updateUser(user, id);
    return res.status(200).json({
      success: true,
      Error: false,
      data: result,
      msg: "user details updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      data: [],
      msg: "error while updating the user Details",
    });
  }
});

async function updateUser(user, id) {
  return new Promise((resolve, reject) => {
    con.query("UPDATE user SET first_name = ?,last_name=?,username=?,phone_number=?  WHERE id=?",
      [user.first_name, user.last_name, user.username, user.phone_number, id],
      function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
}


// Login using authentication
router.post("/login", async function (req, res) {
  try {
    const user = req.body;
    const output = await loginUser(user);

    return res.status(200).json({
      success: true,
      error: false,
      data: output,
      token: token,
      msg: "Login Successful",
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
      "SELECT username, password FROM user WHERE username = ? OR email = ?",
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

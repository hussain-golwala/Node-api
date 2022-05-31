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
router.get('/list', authentication, function(req, res, next) {
  con.query('SELECT id, first_name, last_name FROM user WHERE is_deleted = 0', function(err, result) {
      if (err) {
          return res.status(500).json({
              success: false,
              error: true,
              data: [],
              msg: 'Error while fetching data'

          });
      }
      return res.status(200).json({
          success: true,
          error: false,
          data: result,
          msg: 'Data fetched successfully',

      });

  });
});


// registration method
router.post('/create', authentication, function(req, res) {
  const user = req.body;
  console.log('Body :', user);

  bcrypt.hash(user.password, saltRounds, function(err, hash) {
      console.log(hash)
      con.query(`INSERT INTO user(first_name, last_name, email, username, password, phone_number, company) VALUES(?,?,?,?,?,?,?)`, [user.first_name, user.last_name,
              user.email, user.username, hash, user.phone_number, user.company
          ],
          function(err, result) {

              if (err) {
                  console.log('Error : ', err);
                  return res.status(500).json({
                      success: false,
                      error: true,
                      data: [],
                      msg: 'Error while creating user',
                  });
              }

              return res.status(200).json({
                  success: true,
                  error: false,
                  data: result,
                  msg: 'User created success fully',
              });
          });
  });

});

// Soft id delete method
router.delete('/soft/:id', authentication, function(req, res) {
  const id = req.params.id;
  con.query(`UPDATE user SET is_deleted = ? WHERE id = ?`, [1, id], function(err, result) {
      if (err) {
          console.log('Error : ', err);
          return res.status(500).json({
              success: false,
              error: true,
              data: [],
              msg: 'Error while deleting user',
          });
      }
      return res.status(200).json({
          success: true,
          error: false,
          data: result,
          msg: 'User deleted successfully(soft)',
      });
  });

});

// Hard id delete method
router.delete('/hard/:id', authentication, function(req, res) {
  const id = req.params.id;
  con.query(`DELETE FROM user WHERE id = ?`, [id], function(err, result) {
      if (err) {
          console.log('Error : ', err);
          return res.status(500).json({
              success: false,
              error: true,
              data: [],
              msg: 'Error while deleting user',
          });
      }
      return res.status(200).json({
          success: true,
          error: false,
          data: result,
          msg: 'User deleted permanently',
      });
  });

});

// Update data in database with update id method
router.put('/update/:id', authentication, function (req, res) {
    const id = req.params.id;
    const user = req.body;

    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        console.log(hash);
        con.query(`UPDATE user SET first_name = ? , last_name = ? , username = ? , email = ? , password = ? WHERE id = ? `,
        [user.first_name, user.last_name, user.username, user.email, hash, id],
        function (err, result) {
            if (err) {
                console.log("Error", err);
                return res.status(500).json({
                    success: false,
                    error: true,
                    data: [],
                    msg: "Error while updating user",
                });
            }
            return res.status(200).json({
                success: true,
                error: false,
                data: result,
                msg: "User updated successfully",
            });
        });
    });
});





// Login using authentication
router.post("/login", function (req, res) {
    const user = req.body;
    con.query(
      "SELECT username, password, email FROM user WHERE username = ? OR email = ?",
      [user.username, user.email, user.password],
      function (err, result) {
        if (err) {
          return err;
        }
        bcrypt.compare(
          req.body.password,
          result[0].password,
          function (error, rest) {
            var token = jwt.sign(user.username, "my_secret");
            console.log(token);
  
            if (error) {
              return res.status(500).json({
                success: false,
                error: true,
                data: { err: error, rest },
                msg: "Invalid Credentials",
              });
            }
            return res.status(200).json({
              success: true,
              error: false,
              data: result,
              token: token,
              msg: "Login Successful",
            });
          }
        );
      }
    );
  });

module.exports = router;

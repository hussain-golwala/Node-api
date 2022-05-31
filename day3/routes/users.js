var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });



//GET users listing with select method
router.get('/list', function(req, res, next) {
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
router.post('/create', function(req, res) {
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
router.delete('/soft/:id', function(req, res) {
  const id = req.params.id;
  con.query(`UPDATE user SET is_deleted = ? WHERE id = ?`, [2, id], function(err, result) {
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
          msg: 'User created success fully',
      });
  });

});

// Hard id delete method
router.delete('/hard/:id', function(req, res) {
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
          msg: 'User created success fully',
      });
  });

});

// Update data in database with update id method
router.put('/update/:id', function(req, res) {
  const id = req.params.id;
  const user = req.body;

  con.query(`UPDATE user SET first_name = ? , last_name = ? , username = ? , email = ? , password = ? WHERE id = ? `, [user.first_name, user.last_name,
          user.username, user.email, user.password, id
      ],
      function(err, result) {
          // console.log(this.sql);
          if (err) {
              console.log('Error : ', err);
              return res.status(500).json({
                  success: false,
                  error: true,
                  data: [],
                  msg: 'Error while updating user',
              });
          }
          return res.status(200).json({
              success: true,
              error: false,
              data: result,
              msg: 'User updated successfully',
          });
      });
});

//login method 
router.post('/login', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  con.query("Select username, email, password from user where username = ? OR email = ?", [username, email], function(err, result) {
      if (err) {
          return res.status(500).json({
              success: false,
              error: true,
              data: [],
              msg: "Data not exist."
          });
      }
      bcrypt.compare(password, result[0].password, function(err, response) {
          if (response) {
              return res.status(200).json({
                  success: true,
                  error: false,
                  msg: "User LoggedIn Successfully."
              });
          } else {
              return res.status(200).json({
                  success: true,
                  error: false,
                  msg: "Password is incorrect."
              });
          }
      });
  });
});

module.exports = router;

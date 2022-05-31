var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('You called the user listing method');
});

/* POST users listing. */
router.post('/add', function(req, res, next) {
  res.send('You called the user listing method');
});

/* PUT users listing. */
router.put('/save', function(req, res, next) {
  res.send('You called the user edit method');
});

/* DELETE users listing. */
router.delete('/delete', function(req, res, next) {
  res.send('You called the user delete method');
});

/* Id users listing. */
router.get('/:id', function(req, res, next) {
  res.send('You called the user details method');
});

module.exports = router;

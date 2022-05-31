const mysql = require('mysql');
const dbconfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'training'
};
const connection = mysql.createConnection(dbconfig)
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('database connected to',connection.threadId);
  });
module.exports = connection;
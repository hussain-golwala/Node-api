const mysql = require('mysql');

const dbconfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node'
};

const connection = mysql.createConnection(dbconfig);

module.exports = connection;
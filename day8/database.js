const mongoose = require('mongoose');

const connection = mongoose.connect('mongodb://localhost/mongo', {
useNewUrlParser: true,
useUnifiedTopology: true
}).then((connect) => {
console.log('Connected to the database');
}).catch(err => {
console.log('Error while connecting to the database', err);
})

module.exports = connection;
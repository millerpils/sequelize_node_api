const Sequelize = require('sequelize');

// connects to the db on localhost
const connection = new Sequelize('db', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: './database/db.sqlite',
});

module.exports = connection;

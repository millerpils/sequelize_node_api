const Sequelize = require('sequelize');
const connection = require('../sequelize-connect');

// User model
const User = connection.define('User', {
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    validate: {
      // built-in validator
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      // built-in validator
      isAlphanumeric: true,
    },
  },
});

module.exports = User;

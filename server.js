const express = require('express');
const Sequelize = require('sequelize');
const _USERS = require('./users.json');

const app = express();
const port = 8001;

// connects to the db on localhost but saves it to project dir?
const connection = new Sequelize('db', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db.sqlite',
});

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
      // built in validator
      isAlphanumeric: true,
    },
  },
});

app.get('/', (req, res) => {
  User.create({
    name: 'DM',
    bio: 'New bio entry',
  })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

/* 
    sync creates a 'Users' table (pluralised)
    sync also takes care of authenticating
*/
connection
  .sync({
    // logging: console.log,
    force: true, // drops the table
  })
  // adds new row of data
  .then(() => {
    User.bulkCreate(_USERS)
      .then((users) => {
        console.log('Successfully added users.');
      })
      .error((err) => {
        console.log(err);
      });
  })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.error('Unable to connect:', err);
  });

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = 8001;

// connects to the db on localhost but saves it to project dir?
const connection = new Sequelize('db', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db.sqlite',
});

// User model
const User = connection.define(
  'User',
  {
    // uses a "custom" primary key, e.g 33d5e730-0368-4f29-8fff-afaf7d31b892
    uuid: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: Sequelize.STRING,
      validate: {
        len: {
          args: [3],
          msg: 'Name must be 3 characters or more in length.',
        },
      },
    },
    bio: Sequelize.TEXT,
  },
  {
    timestamps: false,
  }
);

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
    logging: console.log,
    force: true, // drops the table
  })
  // adds new row of data
  .then(() => {
    User.create({
      name: 'Dan',
      bio: 'New bio entry',
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

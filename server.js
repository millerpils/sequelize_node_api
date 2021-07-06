const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = 8001;

const connection = new Sequelize('db', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db.sqlite',
  operatorsAliases: false,
});

connection
  .authenticate()
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.error('Unable to connect:', err);
  });

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

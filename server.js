const express = require('express');
const _USERS = require('./users.json');
const User = require('./models/User');
const app = express();
const port = 8001;

// pass req.body
app.use(express.json());

app.get('/users/:id', (req, res) => {
  User.findOne({
    where: { id: req.params.id },
  })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

app.get('/users', (req, res) => {
  User.findAll()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

app.post('/users', (req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

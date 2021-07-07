const express = require('express');
const _USERS = require('./users.json');
const User = require('./models/User');
const app = express();
const port = 8001;

// pass req.body
app.use(express.json());

// CREATE
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

// READ
app.get('/users', (req, res) => {
  User.findAll()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

// READ
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

// UPDATE
app.put('/users/:id', (req, res) => {
  User.update(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

// UPDATE
app.patch('/users/:id', (req, res) => {
  user = {};

  Object.keys(req.body).forEach((key) => {
    user[key] = req.body[key];
  });

  User.update(user, {
    where: {
      id: req.params.id,
    },
  })
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

// DELETE
app.delete('/users/:id', (req, res) => {
  User.destroy({
    where: { id: req.params.id },
  })
    .then(() => {
      res.send('User deleted.');
    })
    .catch((err) => {
      res.send(404).send(err.message);
    });
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

const connection = require('./sequelize-connect');
const Sequelize = require('sequelize');
const _USERS = require('./json/users.json');
const express = require('express');
const app = express();
const port = 8001;

// pass req.body
app.use(express.json());

/* 
    sync creates a 'Users' table (pluralised)
    sync also takes care of authenticating
*/
connection
  .sync({
    // logging: console.log,
    // force: true, // drops the table
  })
  .then(() => {
    // User.bulkCreate(_USERS)
    //   .then((users) => {
    //     console.log('Successfully added users.');
    //   })
    //   .error((err) => {
    //     console.log(err);
    //   });
  })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.error('Unable to connect:', err);
  });

const User = connection.define('User', {
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true, // built-in validator
    },
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      isAlphanumeric: true, // built-in validator
    },
  },
});

const Post = connection.define('Post', {
  title: Sequelize.STRING,
  content: Sequelize.TEXT,
});

Post.belongsTo(User);

/*
  USERS
*/

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

/*
  POSTS
*/

// CREATE
app.post('/posts', (req, res) => {
  Post.create({
    UserId: req.body.UserId,
    title: req.body.title,
    content: req.body.content,
  })
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

// READ
app.get('/posts', (req, res) => {
  Post.findAll({
    include: [User],
  })
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

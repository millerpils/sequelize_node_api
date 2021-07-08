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
    //force: true, // drops the table
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

const Comment = connection.define('Comment', {
  comment: Sequelize.STRING,
});

// one-to-one relationship - foreign key UserId gets added to post table
Post.belongsTo(User);

// one-to-one relationship
Comment.belongsTo(Post);

// one-to-one relationship
Comment.belongsTo(User);

// one-to-many relationship - Posts array with UserId added to found user
User.hasMany(Post);

// one-to-many relationship - Posts array with UserId added to found user
User.hasMany(Comment);

// one-to-many relationship - Posts array with UserId added to found user
Post.hasMany(Comment); // alias can be added

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
  User.findAll({
    include: [Post, Comment],
  })
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
    include: [Comment],
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
    UserId: req.body.userid,
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
    include: [Comment],
  })
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

/*
  COMMENTS
*/

// CREATE
app.post('/comments', (req, res) => {
  Comment.create({
    PostId: req.body.postid,
    UserId: req.body.userid,
    comment: req.body.comment,
  })
    .then((comment) => {
      res.json(comment);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

// READ
app.get('/comments', (req, res) => {
  Comment.findAll({
    include: [Post],
  })
    .then((comment) => {
      res.json(comment);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

// READ
app.get('/comments/:id', (req, res) => {
  Comment.findOne({
    where: { id: req.params.id },
    include: [User],
  })
    .then((comment) => {
      res.json(comment);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

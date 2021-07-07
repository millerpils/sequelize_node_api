const Sequelize = require('sequelize');

// connects to the db on localhost but saves it to project dir?
const connection = new Sequelize('db', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db.sqlite',
});

/* 
    sync creates a 'Users' table (pluralised)
    sync also takes care of authenticating
*/
connection
  .sync({
    logging: console.log,
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

module.exports = connection;

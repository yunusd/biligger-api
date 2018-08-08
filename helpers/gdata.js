const mongoose = require('mongoose');
const db = require('../models');

mongoose.connect('mongodb://admin:pass@localhost:27017/biligger', { useNewUrlParser: true });

db.User.remove({}).then(() => {
  const user = new db.User({
    username: 'bob',
    password: 'secret',
    email: 'email@email',
    roles: 'user',
    degree: 'soft',
  });
  user.save((err, dbUser) => {
    if (!err) return console.log(dbUser);
    console.log(err);
  });
});

db.Client.remove({}).exec().then(
  db.Client.create({
    name: 'mobile',
    clientId: 'abc123',
    clientSecret: 'ssh-secret',
    trustedClient: true,
  }),
);


setTimeout(() => {
  db.Client.findOne({ clientId: 'abc123' }).exec().then((client) => {
    console.log(client.clientId);
  }).then(
    () => mongoose.disconnect(),
  )
    .catch(err => console.log(err));
}, 3000);

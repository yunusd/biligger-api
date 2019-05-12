const mongoose = require('mongoose');
const { Invite } = require('../models');

mongoose.connect('mongodb://admin:pass@localhost:27017/biligger', { useNewUrlParser: true });

const func = async () => {
  const number = 1000;
  for (let i = 0; i < number; i += 1) {
    // creates maximum up to 1000 invite in 3000 ms (depends processor power)
    await Invite.create({});
  }

  setTimeout(() => {
    mongoose.disconnect();
  }, 3000);
};

func();

const mongoose = require('mongoose');
const { Invite } = require('../models');
const config = require('../config');

mongoose.connect(config.db.url, config.db.options);

const func = async () => {
  const number = 1000;
  for (let i = 0; i < number; i += 1) {
    // creates maximum up to 1000 invite in 3000 ms (depends processor power)
    try {
      await Invite.create({});
    } catch (e) {
      console.log(e);
    }
  }

  setTimeout(() => {
    mongoose.disconnect();
  }, 3000);
};

func();

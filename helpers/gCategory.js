const mongoose = require('mongoose');
const { Category } = require('../models');
const config = require('../config');

mongoose.connect(config.db.url, config.db.options);

const names = ['bilim', 'teknoloji', 'sanat', 'politika', 'ekonomi', 'edebiyat'];

names.forEach(async (val) => {
  try {
    await Category.create({
      name: val,
    });
  } catch (e) {
    console.log(e);
  }
});

setTimeout(() => {
  mongoose.disconnect();
}, 3000);

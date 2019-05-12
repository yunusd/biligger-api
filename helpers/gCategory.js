const mongoose = require('mongoose');
const { Category } = require('../models');

mongoose.connect('mongodb://admin:pass@localhost:27017/biligger', { useNewUrlParser: true });

const names = ['bilim', 'teknoloji', 'sanat', 'politika', 'ekonomi', 'edebiyat'];

names.forEach(async (val) => {
  await Category.create({
    name: val,
  });
});

setTimeout(() => {
  mongoose.disconnect();
}, 3000);

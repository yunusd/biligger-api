const mongoose = require('mongoose');
const { Category } = require('../models');

mongoose.connect('mongodb://admin:pass@localhost:27017/biligger', { useNewUrlParser: true });

const names = ['Teknoloji', 'Bilim', 'Spor', 'Sanat', 'Yaşam Biçimi'];

names.forEach(async (val) => {
  // console.log(val);
  await Category.create({
    name: val,
  });
});

setTimeout(() => {
  mongoose.disconnect();
}, 3000);

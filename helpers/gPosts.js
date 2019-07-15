const mongoose = require('mongoose');
const faker = require('faker');

const { Post, User, Category } = require('../models');
const config = require('../config');

const categories = ['bilim', 'teknoloji', 'sanat', 'politika', 'ekonomi', 'edebiyat'];

// Delete categories and posts before creating new ones
Category.deleteMany({}, (err, res) => {
  if (!err) return res;
});
Post.deleteMany({}, (err, res) => {
  if (!err) return res;
});
console.log('TÜM KATEGORİ VE BİLİGLER SİLİNDİ');

categories.forEach(async (val) => {
  try {
    await Category.create({
      name: val,
    });
  } catch (e) {
    console.log(e);
  }
});

(async function () {
  mongoose.connect(config.db.url, config.db.options);
  console.log('VERİTABANINA BAĞLANDI');

  const isExist = await User.findOne({ username: 'admin' });

  // if there is user with username admin, then delete that user.
  if (isExist) {
    const deletedUser = await User.findByIdAndRemove(isExist.id);
    if (deletedUser) console.log(`${deletedUser.username.toUpperCase()} KULLANICISI SİLİNDİ`);
  }

  const user = await User.create({
    username: 'admin',
    email: 'admin@gmail.com',
    degree: 'admin',
    password: 'password*1',
    passwordCheck: 'password*1',
  });
  if (!user) throw new Error('KULLANICI OLUŞTURULAMADI');

  console.log(`${user.username.toUpperCase()} KULLANICISI OLUŞTURULDU`);

  let count = 0;

  const categoriesId = await Category.find({});
  const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min);
  for (let i = 0; i < 50; i++) {
    await Post.create({
      title: faker.lorem.sentence(10),
      content: faker.lorem.paragraphs(),
      author: user.id,
      category: categoriesId[getRandom(0, 6)].id, // Picking random category
    });
    count += 1;
  }

  console.log(`${count} BİLİG OLUŞTURULDU`);

  setTimeout(() => {
    mongoose.disconnect();
    console.log('VERİTABANI BAĞLANTISI KESİLDİ');
  }, 3000);
}());

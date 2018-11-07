const express = require('express');
const passport = require('passport');
const { validationResult } = require('express-validator/check');

const { Post } = require('../models');
const { validatePost } = require('../middlewares/validate');

const router = express.Router();

function isUser(authorId, userId) {
  return new Promise((resolve, reject) => {
    if (authorId === userId) {
      resolve('sahip');
    } else {
      reject(new Error('Yetkisiz Kullanıcı'));
    }
  });
}

router.get('/post', async (req, res) => {
  const post = await Post.find({});
  res.send(post);
});

router.post('/post', validatePost, passport.authenticate('bearer', { session: false }), async (req, res, next) => {
  const errors = await validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const post = await Post.create({
    title: req.body.title,
    content: req.body.content,
    url: req.body.url,
    author: req.user.id,
  });

  res.status(201).send(post);
});

router.put('/post/edit', validatePost, passport.authenticate('bearer', { session: false }), async (req, res) => {
  const errors = await validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  await isUser(req.body.author, req.user.id);

  const post = await Post.findByIdAndUpdate(req.body.id, {
    title: req.body.title,
    content: req.body.content,
    url: req.body.url,
    author: req.body.author,
  }, { new: true });
  if (!post) throw new Error('Gönderi bulunamadı');
  res.status(200).send(post);
});

router.delete('/post/delete', passport.authenticate('bearer', { session: false }), async (req, res) => {
  await isUser(req.body.author, req.user.id);
  const post = await Post.findByIdAndRemove(req.body.id);
  if (!post) throw new Error('Gönderi bulunamadı');
  return res.status(200).send({
    success: 'Gönderi silindi',
  });
});

module.exports = router;

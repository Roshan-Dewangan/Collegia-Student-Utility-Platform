const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

router.post('/:post_id', [
  auth,
  [
    check('text', 'Text is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = new Comment({
      text: req.body.text,
      user: req.user.id,
      post: req.params.post_id
    });

    const comment = await newComment.save();
    post.comments.push(comment._id);
    await post.save();

    // Populate user details in the response
    await comment.populate('user', ['name', 'profilePicture']);
    
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.put('/upvote/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    if (comment.upvotes.some(upvote => upvote.user.toString() === req.user.id)) {
      comment.upvotes = comment.upvotes.filter(
        ({ user }) => user.toString() !== req.user.id
      );
    } else {
      comment.upvotes.unshift({ user: req.user.id });
    }

    await comment.save();
    res.json(comment.upvotes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const post = await Post.findById(comment.post);
    if (post) {
      post.comments = post.comments.filter(
        commentId => commentId.toString() !== req.params.id
      );
      await post.save();
    }

    await comment.remove();
    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;

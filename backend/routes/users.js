const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.put('/profile', auth, async (req, res) => {
  const {
    name,
    department,
    semester,
    skills,
    achievements,
    projects,
    socialLinks
  } = req.body;

  const profileFields = {};
  if (name) profileFields.name = name;
  if (department) profileFields.department = department;
  if (semester) profileFields.semester = semester;
  if (skills) profileFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
  if (achievements) profileFields.achievements = Array.isArray(achievements) ? achievements : achievements.split(',').map(achievement => achievement.trim());
  if (projects) profileFields.projects = projects;
  if (socialLinks) profileFields.socialLinks = socialLinks;

  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

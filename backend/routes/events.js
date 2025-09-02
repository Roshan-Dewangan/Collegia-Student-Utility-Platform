const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Event = require('../models/Event');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = 'uploads/events';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
}).single('image');

router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 }) 
      .populate('user', ['name'])
      .populate('attendees.user', ['name', 'profilePicture']);
    
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('user', ['name', 'email', 'profilePicture'])
      .populate('attendees.user', ['name', 'profilePicture']);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }
    
    const {
      title,
      description,
      date,
      location,
      organizer
    } = req.body;
    
    if (!title || !description || !date || !location || !organizer) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    
    try {
      const newEvent = new Event({
        user: req.user.id,
        title,
        description,
        date,
        location,
        organizer,
        image: req.file ? req.file.path : null
      });
      
      const event = await newEvent.save();
      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
});

router.put('/attend/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    const isAttending = event.attendees.some(
      attendee => attendee.user.toString() === req.user.id
    );
    
    if (isAttending) {
      event.attendees = event.attendees.filter(
        ({ user }) => user.toString() !== req.user.id
      );
    } else {
      event.attendees.push({ user: req.user.id });
    }
    
    await event.save();
    
    const updatedEvent = await Event.findById(req.params.id)
      .populate('attendees.user', ['name', 'profilePicture']);
    
    res.json(updatedEvent.attendees);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    if (event.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    if (event.image) {
      try {
        fs.unlinkSync(event.image);
      } catch (err) {
        console.error(`Failed to delete image: ${event.image}`, err);
      }
    }
    
    await event.remove();
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;

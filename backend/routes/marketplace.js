const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const MarketplaceItem = require('../models/MarketplaceItem');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = 'uploads/marketplace';
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
}).array('images', 5); // Max 5 images

router.get('/', auth, async (req, res) => {
  try {
    const items = await MarketplaceItem.find()
      .sort({ date: -1 })
      .populate('user', ['name', 'email']);
    
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id)
      .populate('user', ['name', 'email', 'profilePicture']);
    
    if (!item) {
      return res.status(404).json({ msg: 'Marketplace item not found' });
    }
    
    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Marketplace item not found' });
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
      category,
      price,
      condition
    } = req.body;
    
    if (!title || !description || !category || !price || !condition) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    
    try {
      const imagePaths = [];
      if (req.files) {
        req.files.forEach(file => {
          imagePaths.push(`${file.path}`);
        });
      }
      
      const newItem = new MarketplaceItem({
        user: req.user.id,
        title,
        description,
        category,
        price,
        condition,
        images: imagePaths
      });
      
      const item = await newItem.save();
      res.json(item);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
});

router.put('/:id', auth, async (req, res) => {
  const {
    title,
    description,
    category,
    price,
    condition,
    status
  } = req.body;
  
  const itemFields = {};
  if (title) itemFields.title = title;
  if (description) itemFields.description = description;
  if (category) itemFields.category = category;
  if (price) itemFields.price = price;
  if (condition) itemFields.condition = condition;
  if (status) itemFields.status = status;
  
  try {
    let item = await MarketplaceItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    item = await MarketplaceItem.findByIdAndUpdate(
      req.params.id,
      { $set: itemFields },
      { new: true }
    );
    
    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    if (item.images && item.images.length > 0) {
      item.images.forEach(imagePath => {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error(`Failed to delete image: ${imagePath}`, err);
        }
      });
    }
    
    await item.remove();
    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;

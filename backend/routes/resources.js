const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = 'uploads/resources';
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
  limits: { fileSize: 25000000 }, // 25MB limit
  fileFilter: function(req, file, cb) {
    const fileTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|zip/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
      return cb(null, true);
    } else {
      cb('Error: Invalid file type. Only documents and archives are allowed.');
    }
  }
}).single('file');

router.get('/', auth, async (req, res) => {
  try {
    const resources = await Resource.find()
      .sort({ date: -1 })
      .populate('user', ['name', 'department']);
    
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/filter', auth, async (req, res) => {
  const { subject, department, semester, resourceType } = req.query;
  
  const filterOptions = {};
  if (subject) filterOptions.subject = subject;
  if (department) filterOptions.department = department;
  if (semester) filterOptions.semester = semester;
  if (resourceType) filterOptions.resourceType = resourceType;
  
  try {
    const resources = await Resource.find(filterOptions)
      .sort({ date: -1 })
      .populate('user', ['name', 'department']);
    
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('user', ['name', 'department']);
    
    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }
    
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a file' });
    }
    
    const {
      title,
      description,
      subject,
      department,
      semester,
      resourceType
    } = req.body;
    
    if (!title || !description || !subject || !department || !semester || !resourceType) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('File deletion error:', err);
      }
      return res.status(400).json({ msg: 'All fields are required' });
    }
    
    try {
      const newResource = new Resource({
        user: req.user.id,
        title,
        description,
        fileUrl: req.file.path,
        subject,
        department,
        semester,
        resourceType
      });
      
      const resource = await newResource.save();
      res.json(resource);
    } catch (err) {
      console.error(err.message);
      try {
        fs.unlinkSync(req.file.path);
      } catch (deleteErr) {
        console.error('File deletion error:', deleteErr);
      }
      res.status(500).send('Server Error');
    }
  });
});

router.put('/download/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    
    resource.downloads += 1;
    await resource.save();
    
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    
    if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    try {
      fs.unlinkSync(resource.fileUrl);
    } catch (err) {
      console.error(`Failed to delete file: ${resource.fileUrl}`, err);
    }
    
    await resource.remove();
    res.json({ msg: 'Resource removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;

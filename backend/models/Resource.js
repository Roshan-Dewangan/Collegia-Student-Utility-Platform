const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  resourceType: {
    type: String,
    enum: ['notes', 'paper', 'assignment', 'other'],
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resource', ResourceSchema);

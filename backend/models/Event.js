const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
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
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  attendees: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);

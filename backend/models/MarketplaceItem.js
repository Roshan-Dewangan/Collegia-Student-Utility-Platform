const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarketplaceItemSchema = new Schema({
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
  category: {
    type: String,
    enum: ['book', 'equipment', 'others'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    enum: ['new', 'like new', 'good', 'fair', 'poor'],
    required: true
  },
  images: [String],
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MarketplaceItem', MarketplaceItemSchema);

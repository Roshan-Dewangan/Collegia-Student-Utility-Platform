const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  text: {
    type: String,
    required: true
  },
  upvotes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);

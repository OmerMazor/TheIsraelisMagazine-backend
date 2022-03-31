const mongoose = require('mongoose');

const NewSchema = mongoose.Schema({
  subject: {
    type: String
  },
  title: {
    type: String
  },
  subTitle: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  content: [{
    text: String,
    image: String
  }],
  date: {
    type: String,
    default: new Date().toLocaleDateString()
  },
  realDate: {
    type: Date,
    default: Date.now()
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }],
  comments: [{
    commentUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
      type: String
    },
    date: {
        type: String,
        default: new Date().toLocaleDateString()
    }
}]
});

module.exports = mongoose.model('New', NewSchema);

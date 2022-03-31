const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
  type: {
    type: String,
    default: "Photo"
  },
  image: {
    type: String
  },
  subject: {
    type: String,
    default: 'general'
  },
  userTag: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
    default: new Date().toLocaleDateString()
  },
  realDate: {
    type: Date,
    default: Date.now()
  },
  likes: {
    type: Number
  },
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

module.exports = mongoose.model('Image', ImageSchema);

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  type: {
    type: String,
    default: "Post"
  },
  image: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    default: 'general'
  },
  status: {
    type:String
  },
  userTag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
    // required: true
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

module.exports = mongoose.model('Post', postSchema);

const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
  type: {
    type: String,
    default: "Article"
  },
  subject: {
    type: String
  },
  content: {
    type: String
  },
  userTag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
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

module.exports = mongoose.model('Article', ArticleSchema);

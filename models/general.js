const mongoose = require('mongoose');

const GeneralSchema = mongoose.Schema({
  type: {
    type: String,
    default: "General"
  },
  subject: {
    type: String
  },
  content: {
    type: String
  },
  smiley: {
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
    default: true
  },
  date: {
    type: String,
    default: new Date().toLocaleDateString()
  },
  realDate: {
    type: Date,
    default: Date.now()
  },
  power: [{
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

module.exports = mongoose.model('General', GeneralSchema);

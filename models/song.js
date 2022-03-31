const mongoose = require('mongoose');

const songSchema = mongoose.Schema({

  name: {
    type:String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  translate: {
    type: String,
    required: true
  },
  imagePath: {
    type: String
  },
  creator: {
    type: String
  }
});

module.exports = mongoose.model('Song', songSchema);

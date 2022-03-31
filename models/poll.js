const mongoose = require('mongoose');

const PollsSchema = mongoose.Schema({
  question: {
    type: String
  },
  answers: [{
    name: String,
    value: Number
  }
  ]
});

module.exports = mongoose.model('Poll', PollsSchema);

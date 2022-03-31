const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");



const userSchema = mongoose.Schema({
  profile: {
    type: String
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailCode: {
    type: Number
  },
  email: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  fullname: {
    type: String
  },
  country: {
    type: String
  },
  birthday: {
    type: Date
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  },
  height: {
    type: Number
  },
  weight: {
    type: Number
  },
  images: {
    type: Array
  },
  isImages: {
    type: Boolean,
    default: true
  },
  about: {
    type: String
  },
  isModel: {
    type: Boolean
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isFamous: {
    type: Boolean,
    default: false
  },
  instagram: {
    username: {
      type: String
    },
    followers: {
      type: Number
    }
  },
 likes: [{
    likeUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now
    }
}],
power: {
  type: Number,
  default: 0
},
range: {
  type: Number
},
content: [{
  type: Object
}],
idImage: {
  type: String,
  default: null
},
notifications: [{
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  text: String,
  seen: Boolean,
  date: Date
}]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    data: Buffer,
    contentType: String
  },
  role: {
    type: String,
    default: 'Student'
  },
  date: {
    type: Date,
    default: Date.now
  },
  xp: {
    type: Number,
    default: 0
  },
  class: {
    className: {
      type: String,
      default: null
    },
    questIndex: {
      type: Number,
      defualt: 0
    }
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

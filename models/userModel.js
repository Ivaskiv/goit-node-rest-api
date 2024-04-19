const mongoose = require('mongoose');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  tokens: [
    {
      token: {
        type: String,
        default: null,
        required: true,
      },
    },
  ],
  avatar: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;

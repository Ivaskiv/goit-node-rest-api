//userService.js - цей код відповідає за створення та пошук користувачів у системі
//забезпечує функції для створення нових користувачів у системі та
//пошуку вже існуючих користувачів за їх електронною поштою

const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const createUser = async userData => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  const newUser = new User({
    email: userData.email,
    password: hashedPassword,
    subscription: userData.subscription || 'starter',
    avatarURL: userData.avatarURL,
  });
  return newUser.save();
};

const findUserByEmail = async email => {
  return User.findOne({ email });
};

module.exports = { createUser, findUserByEmail };

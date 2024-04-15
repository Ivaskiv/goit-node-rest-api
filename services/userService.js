//userService.js - цей код відповідає за створення та пошук користувачів у системі = забезпечує функції для створення нових користувачів у системі та пошуку вже існуючих користувачів за їх електронною поштою

const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const createUserService = async userData => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = new User({
    email: userData.email,
    password: hashedPassword,
    subscription: userData.subscription || 'starter',
  });
  return newUser.save();
};

const findUserByEmail = async email => {
  return User.findOne({ email });
};

module.exports = { createUserService, findUserByEmail };

//https://mongoosejs.com/docs/queries.html
//https://www.npmjs.com/package/bcryptjs

//userController.js
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { createUser, findUserByEmail } = require('../services/userService');
const { generateToken } = require('../services/authService');
const { errorWrapper } = require('../helpers/errorWrapper');
const { updateUserAvatar } = require('../services/avatarService');

const userRegister = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  // перевірка, чи існує вже користувач з такою електронною поштою
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email in use' });
  }
  const newUser = await createUser({ email, password });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

const loginUser = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    //якщо користувача з таким email не знайдено
    return res.status(401).json({ message: 'Email or password is wrong' });
  }
  //створення токена
  const token = generateToken({ userId: user._id });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
});

const logoutUser = errorWrapper(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { token: null });
  //повернути успішну відповідь 204 No Content
  res.sendStatus(204);
});

const getCurrentUser = errorWrapper(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
});

const updateAvatar = errorWrapper(async (req, res, next) => {
  const { file } = req;
  const userId = req.user._id;
  User;

  if (!file) {
    return res.status(400).send('Avatar file is missing. Please attach a file to proceed.');
  }

  const avatarUrl = await updateUserAvatar(userId, file);
  res.status(200).json({ avatarUrl });
});

module.exports = { userRegister, loginUser, logoutUser, getCurrentUser, updateAvatar };

//https://www.npmjs.com/package/bcrypt
//https://my-js.org/docs/cheatsheet/jsonwebtoken/

//userController.js
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { createUser, findUserByEmail } = require('../services/userService');
const { generateToken } = require('../services/authService');
const { depricatedTokens } = require('../helpers/authToken');
const { errorWrapper } = require('../helpers/errorWrapper');

const userRegister = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

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

  res.status(200).json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
});

const logoutUser = errorWrapper(async (req, res, next) => {
  depricatedTokens.push(req.token);
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

module.exports = { userRegister, loginUser, logoutUser, getCurrentUser };

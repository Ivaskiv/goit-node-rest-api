// userController.js
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { createUser, findUserByEmail } = require('../services/userService');
const { generateToken } = require('../services/authService');
const { errorWrapper } = require('../helpers/errorWrapper');
const { updateUserAvatar } = require('../services/avatarService');
const { sendVerificationEmail } = require('../services/emailService');
const { v4: uuidv4 } = require('uuid');

const { BASE_URL } = process.env;

//!Крок 2: Створення ендпоінта для верифікації email
const verifyUser = errorWrapper(async (req, res, next) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    return res.status(400).json({ message: 'Missing verification token' });
  }
  // знайти користувача за токеном верифікації
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  // якщо користувач вже пройшов верифікацію, повернути помилку
  if (user.verify) {
    return res.status(400).json({ message: 'Verification has already been passed' });
  }
  // встановити verificationToken в null і verify в true
  user.verify = true;
  user.verificationToken = null;
  await user.save();
  // повернути успішну відповідь
  return res.status(200).json({ message: 'Verification successful' });
});

//!Крок 3: Відправка email користувачу з посиланням для верифікації
const userRegister = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  // перевірка, чи існує вже користувач з такою електронною поштою
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'Verification email sent' });
  }
  // генерація унікального токена для верифікації email
  const verificationToken = uuidv4();
  const newUser = await createUser({ email, password, verificationToken });
  //!
  // встановлення токену в об'єкт користувача
  //"створити verificationToken для користувача і записати його в БД"
  newUser.verificationToken = verificationToken;
  await newUser.save();
  //!
  // відправити лист з посиланням для верифікації email
  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: avatarUrl,
    },
  });
});

//!Крок 4: Повторна відправка email користувачу з посиланням для верифікації
const resendVerificationEmail = errorWrapper(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Missing required field: email' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.verify) {
    return res.status(400).json({ message: 'Verification has already been passed' });
  }
  // перевірка, чи у користувача вже є verificationToken
  if (!user.verificationToken) {
    user.verificationToken = uuidv4();
  }

  const verificationLink = `${BASE_URL}/users/verify/${user.verificationToken}`;
  await sendVerificationEmail(user.email, verificationLink);

  return res.status(200).json({ message: 'Verification email sent' });
});

const loginUser = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    // якщо користувача з таким email не знайдено або пароль невірний
    return res.status(401).json({ message: 'Email or password is wrong' });
  }
  // перевірка, чи email користувача пройшов верифікацію
  if (!user.verify) {
    return res.status(401).json({ message: 'Email is not verified' });
  }
  // створення токена для автентифікації
  const token = generateToken({ userId: user._id });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
});

const logoutUser = errorWrapper(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { token: null });
  // повернути успішну відповідь 204 No Content
  res.sendStatus(204);
});

const getCurrentUser = errorWrapper(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
  });
});

const updateAvatar = errorWrapper(async (req, res, next) => {
  const { file } = req;
  const userId = req.user._id;
  User;

  if (!file) {
    return res
      .status(400)
      .json({ message: 'Avatar file is missing. Please attach a file to proceed.' });
  }

  const avatarUrl = await processJimpAvatar(file, userId);
  // оновити поле avatarURL у користувача з _id === userId
  await User.findByIdAndUpdate(userId, { avatarURL: avatarUrl });
  res.status(200).json({ avatarUrl });
});

module.exports = {
  userRegister,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAvatar,
  verifyUser,
  resendVerificationEmail,
};

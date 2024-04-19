//userController.js

const { createUser, findUserByEmail } = require('../services/userService');
const { generateToken } = require('../services/authService');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const path = require('path');
const User = require('../models/userModel');
const Jimp = require('jimp');
const { depricatedTokens } = require('../helpers/authToken');
const fs = require('fs').promises;

const userRegister = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(409).json({ message: 'Email in use' });
    }
    //!
    const avatarUrl = gravatar.url(email, { s: '200', r: 'pg', d: 'robohash' });
    //!

    const createNewUser = await createUser({
      email,
      password,
      avatarUrl,
    });

    res.status(201).json({
      user: {
        email: createNewUser.email,
        subscription: createNewUser.subscription,
        avatarURL: createNewUser.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      //якщо користувача з таким email не знайдено
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    // створення токена
    const token = generateToken({ userId: user._id });

    res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    depricatedTokens.push(req.token);
    //перевірити чи існує користувач
    const user = req.user;
    //повернути успішну відповідь 204 No Content
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    //
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
      });
    }
    //
    const image = await Jimp.read(req.file.path);
    await image.resize(250, 250).writeAsync(req.file.path);
    //
    const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
    //
    await fs.rename(req.file.path, path.join(__dirname, '..public/avatars/${filename}'));

    //
    req.user.avatarURL = `/avatars/${fileName}`;
    await req.user.save();

    //
    res.status(200).json({ avatarURL: req.user.avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = { userRegister, loginUser, logoutUser, getCurrentUser, updateAvatar };

//https://www.npmjs.com/package/bcrypt
//https://my-js.org/docs/cheatsheet/jsonwebtoken/

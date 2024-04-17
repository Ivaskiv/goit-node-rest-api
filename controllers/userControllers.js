//userController.js

const { createUser, findUserByEmail } = require('../services/userService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { generateToken } = require('../services/authService');
const { authToken } = require('../helpers/authToken');

const userRegister = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const createNewUser = await createUser({ email, password });

    res.status(201).json({
      user: { email: createNewUser.email, subscription: createNewUser.subscription },
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
    //перевірити чи існує користувач
    const userId = req.user._id;
    //
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    //видалити токен
    user.token = null;
    await user.save();
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

module.exports = { userRegister, loginUser, logoutUser, getCurrentUser };

//https://www.npmjs.com/package/bcrypt
//https://my-js.org/docs/cheatsheet/jsonwebtoken/

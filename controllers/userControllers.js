//userController.js

const User = require('../models/userModel');
const { createUserService, findUserByEmail } = require('../services/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userRegister = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const createNewUser = await createUserService({ email, password });
    const token = jwt.sign({ userId: createNewUser._id }, 'your_secret_key', { expiresIn: '1h' });

    res.status(201).json({
      user: { email: createNewUser.email, subscription: createNewUser.subscription },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userExists = await findUserByEmail(email);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }
    const token = jwt.sign({ id: user._id }, 'yourSecretKey', { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: { email: createNewUser.email, subscription: createNewUser.subscription },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { userRegister, loginUser };

//https://www.npmjs.com/package/bcrypt
//https://my-js.org/docs/cheatsheet/jsonwebtoken/

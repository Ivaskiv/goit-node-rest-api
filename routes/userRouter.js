//userRouter.js
const express = require('express');
const { validateBody } = require('../helpers/validateBody.js');
const { createUserSchema, loginUserSchema } = require('../schemas/userSchema');
const {
  userRegister,
  loginUser,
  logoutUser,
  getCurrentUser,
} = require('../controllers/userControllers.js');
const { authToken } = require('../helpers/authToken.js');

const userRouter = express.Router();

userRouter.post('/register', validateBody(createUserSchema), userRegister);

userRouter.post('/login', validateBody(loginUserSchema), loginUser);

userRouter.post('/logout', authToken, logoutUser);

userRouter.get('/current', authToken, getCurrentUser);

module.exports = userRouter;

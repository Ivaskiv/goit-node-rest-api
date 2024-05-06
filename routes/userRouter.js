//userRouter.js
const express = require('express');
const { validateBody } = require('../middleware/validateBody.js');
const { createUserSchema, loginUserSchema } = require('../schemas/userSchema');
const {
  userRegister,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAvatar,
} = require('../controllers/userControllers.js');
const { authToken } = require('../middleware/authToken.js');

const userRouter = express.Router();

const upload = require('../config/multerConfig.js');

userRouter.post('/register', validateBody(createUserSchema), userRegister);

userRouter.post('/login', validateBody(loginUserSchema), loginUser);

userRouter.post('/logout', authToken, logoutUser);

userRouter.get('/current', authToken, getCurrentUser);

userRouter.patch('/avatars', authToken, upload.single('avatar'), updateAvatar);

module.exports = userRouter;

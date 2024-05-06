//userRouter.js
const express = require('express');
const { validateBody } = require('../middleware/validateBody.js');
const { createUserSchema, loginUserSchema, verifyUserSchema } = require('../schemas/userSchema');
const {
  userRegister,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAvatar,
  verifyUser,
  resendVerificationEmail,
} = require('../controllers/userControllers.js');
const { authToken } = require('../middleware/authToken.js');

const userRouter = express.Router();

const upload = require('../config/multerConfig.js');

userRouter.post('/register', validateBody(createUserSchema), userRegister);

userRouter.post('/login', validateBody(loginUserSchema), loginUser);

userRouter.post('/logout', authToken, logoutUser);

userRouter.get('/current', authToken, getCurrentUser);

userRouter.patch('/avatars', authToken, upload.single('avatar'), updateAvatar);

userRouter.get('/verify/:verificationToken', verifyUser);

userRouter.post('/verify', validateBody(verifyUserSchema), resendVerificationEmail);

module.exports = userRouter;

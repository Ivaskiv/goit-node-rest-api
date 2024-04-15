//userRouter.js
const express = require('express');

const { validateBody } = require('../helpers/validateBody.js');
const { createUserSchema, loginUserSchema } = require('../schemas/userSchema');
const { userRegister, loginUser } = require('../controllers/userControllers.js');

const userRouter = express.Router();

userRouter.post('/register', validateBody(createUserSchema), userRegister);

userRouter.post('/login', validateBody(loginUserSchema), loginUser);

userRouter.post('/logout');

userRouter.get('/current');

module.exports = userRouter;

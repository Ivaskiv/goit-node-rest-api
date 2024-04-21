//authToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const secretKey = process.env.JWT_SECRET_KEY || 'your_secure_random_key';

const depricatedTokens = [];

const authToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // перевірити і отримати токен
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  const token = authHeader.split(' ')[1];

  try {
    //валідація токена
    const decoded = jwt.verify(token, secretKey);
    if (depricatedTokens.includes(token)) {
      throw 'Token is depricated';
    }
    //знайти користувача/отримати з токена id користувача
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw 'User not found';
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

//перевірити чи існує користувач
const decodeToken = token => {
  return jwt.verify(token, 'secret_key');
};

module.exports = { authToken, decodeToken, depricatedTokens };

//https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
//https://devzone.org.ua/post/iak-vykorystovuvaty-json-web-tokens-jwt-dlia-avtentyfikatsiyi

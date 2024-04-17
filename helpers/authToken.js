//authToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const secretKey = process.env.JWT_SECRET_KEY || 'your_secure_random_key';

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

    //знайти користувача/отримати з токена id користувача
    const user = await User.findById(decoded.userId);

    // якщо користувач не існує і токен не збігається, то 'Unauthorized'
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    // якщо користувач існує і токен збігається з тим, що знаходиться в базі, записати його дані в req.user і викликати next()
    req.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = { authToken };

//https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
//https://devzone.org.ua/post/iak-vykorystovuvaty-json-web-tokens-jwt-dlia-avtentyfikatsiyi

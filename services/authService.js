//authService.js
const jwt = require('jsonwebtoken');

// отримання секретного ключа з змінної середовища або використання значення за замовчуванням
const secretKey = process.env.JWT_SECRET_KEY || 'your_secure_random_key';

const generateToken = payload => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

module.exports = { generateToken };

//multerConfig.js-модуль, який встановлює конфігурацію для бібліотеки multer для обробки завантажених файлів

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
  // шлях для зберігання завантажених файлів
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../tmp'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  fieldname: 'avatar',
});

module.exports = upload;

//https://docs.gravatar.com/general/images/

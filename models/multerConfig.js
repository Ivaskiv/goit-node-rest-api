//multerConfig.js-модуль, який встановлює конфігурацію для бібліотеки multer для обробки завантажених файлів

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // шлях для зберігання завантажених файлів
    cb(null, path.join(__dirname, '../tmp'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

//https://docs.gravatar.com/general/images/

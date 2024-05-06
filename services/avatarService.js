//avatarService.js
const gravatar = require('gravatar');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Jimp = require('jimp');
const fs = require('fs');

const generateAvatarUrl = email => {
  // s - розмір аватара, r - рівень доступу, d - тип аватара
  const avatarUrl = gravatar.url(email, { s: 200, r: 'g', d: 'identicon', protocol: 'https' });
  return avatarUrl;
};

const processJimpAvatar = async (file, userId) => {
  const tmpDirectory = path.join(__dirname, '../tmp');
  //шлях до папки public/avatars
  const uploadDirectory = path.join(__dirname, '..', 'public', 'avatars');

  //якщо не існує tmp, то створити
  if (!fs.existsSync(tmpDirectory)) {
    fs.mkdirSync(tmpDirectory, { recursive: true });
  }
  //перевірка існування папки public/avatars, якщо не існує - створити
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }

  //генерація унікального імені файлу для конкретного користувача
  const uniqueFileName = `${userId}-${uuidv4()}${path.extname(file.originalname)}`;
  //шлях до обробленого файлу
  const tmpFilePath = path.join(tmpDirectory, uniqueFileName);
  //завантажуємо файл аватарки в папку tmp
  fs.renameSync(file.path, tmpFilePath);

  //обробка аватарки за допомогою Jimp та зміна розміру на 250x250
  const image = await Jimp.read(tmpFilePath);
  await image.resize(250, 250).writeAsync(tmpFilePath);

  //шлях до нового файлу в папці public/avatars
  const avatarFilePath = path.join(uploadDirectory, uniqueFileName);
  fs.renameSync(tmpFilePath, avatarFilePath);

  //повернути URL аватарки
  const avatarUrl = `/avatars/${uniqueFileName}`;
  return avatarUrl;
};

module.exports = { generateAvatarUrl, processJimpAvatar };

//!==========================================
//Для генерації аватара за допомогою Gravatar
//на основі email користувача
//при реєстрації нового користувача потрібно
//використовувати сервіс, оскільки ця операція
//відноситься до логіки обробки даних
//!==========================================

//https://docs.gravatar.com/general/hash/
//https://nodejs.org/api/path.html
//https://www.npmjs.com/package/jimp
//!
//Імпорт через require використовується в Node.js
//для завантаження модулів, що експортуються з інших файлів чи пакетів
//Коли використовувати require, то завантажується вміст модуля у поточний файл,
//і всі експортовані об'єкти (функції, об'єкти, класи тощо) стають доступними в коді
//У Node.js використовується модульна система CommonJS,
// яка використовує require і module.exports

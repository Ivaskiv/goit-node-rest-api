//contactsServices.js
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

// шлях до файлу БД контактів
const contactsPath = path.join(__dirname, '..', 'db', 'contacts.json');

// функція, яка перевіряє чи існує файл з контактами
async function ensureFileExists(contactsPath) {
  try {
    // перевіряємо доступність файлу
    await fs.access(contactsPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // якщо файлу не існує, то створюємо його з порожнім масивом контактів
      await fs.writeFile(contactsPath, '[]');
    } else {
      throw error;
    }
  }
}

// функція для отримання списку контактів з файлу
async function listContacts() {
  // перевіряємо чи є файл
  await ensureFileExists(contactsPath);
  // зчитуємо дані з файлу
  const data = await fs.readFile(contactsPath, 'utf8');
  // парсимо ці дані у форматі JSON для отримання масиву контактів
  return JSON.parse(data);
}

// функція для отримання контакту за його ID
async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find(({ id }) => id === contactId) || null;
  return contact || null;
}

// функція для видалення контакту за його ID
async function removeContact(contactId) {
  let contacts = await listContacts();
  const filteredContacts = contacts.filter(contact => contact.id !== contactId);

  if (contacts.length !== filteredContacts.length) {
    // якщо контакт видаляється, то оновлюємо список контактів
    contacts = filteredContacts;
    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2));
    return { message: 'Contact deleted successfully', code: 200, contacts };
  } else {
    // якщо контакт не знайдено, повертаємо статус 404 "Not found"
    return { message: 'Contact not found', code: 404 };
  }
}

// функція додавання нового контакту
async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const newContact = { id: uuidv4(), name, email, phone };
  // додаємо новий контакт до списку
  contacts.push(newContact);
  // оновлюємо файл
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}
// функція для оновлення контакту за його ID
async function updateContactById(id, updateData) {
  const contacts = await listContacts();
  // знайти індекс контакту, який потрібно оновити
  const contactIndex = contacts.findIndex(contact => contact.id === id);
  // якщо контакт не знайдено, повернути null
  if (contactIndex === -1) {
    return null;
  }
  contacts[contactIndex] = { id, ...contacts[contactIndex], ...updateData };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[contactIndex];
}

module.exports = { listContacts, getContactById, removeContact, addContact, updateContactById };

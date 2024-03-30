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
  try {
    // перевіряємо чи є файл
    await ensureFileExists(contactsPath);
    // зчитуємо дані з файлу
    const data = await fs.readFile(contactsPath, 'utf8');
    // парсимо ці дані у форматі JSON для отримання масиву контактів
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    throw error;
  }
}

// функція для отримання контакту за його ID
async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(({ id }) => id === contactId);
    return contact || null;
  } catch (error) {
    throw error;
  }
}

// функція для видалення контакту за його ID
async function removeContact(contactId) {
  try {
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
  } catch (error) {
    return { error: error.message, code: 500 };
  }
}

// функція додавання нового контакту
async function addContact(data) {
  try {
    const { name, email, phone } = data;
    // генеруємо новий ID для контакту
    const newContact = { id: uuidv4(), name, email, phone };
    const contacts = await listContacts();
    // додаємо новий контакт до списку
    const updateContacts = [...contacts, newContact];
    // оновлюємо файл
    await fs.writeFile(contactsPath, JSON.stringify(updateContacts, null, 2));
    return newContact;
  } catch (error) {
    throw error;
  }
}

// функція для оновлення контакту за його ID
async function updateContactById(contactId, updateData) {
  try {
    const contacts = await listContacts();
    // знайти індекс контакту, який потрібно оновити
    const index = contacts.findIndex(({ id }) => id === contactId);

    // якщо контакт не знайдено, повернути null
    if (index === -1) {
      return null;
    }

    contacts[index] = { ...contacts[index], ...updateData };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  } catch (error) {
    throw error;
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact, updateContactById };

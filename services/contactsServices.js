const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

const contactsPath = path.join(__dirname, '..', 'db', 'contacts.json');

async function ensureFileExists(contactsPath) {
  try {
    await fs.access(contactsPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(contactsPath, '[]');
    } else {
      throw error;
    }
  }
}

async function listContacts() {
  await ensureFileExists(contactsPath);
  const data = await fs.readFile(contactsPath, 'utf8');
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find(({ id }) => id === contactId) || null;
  return contact || null;
}

async function removeContact(contactId) {
  let contacts = await listContacts();
  const filteredContacts = contacts.filter(contact => contact.id !== contactId);

  if (contacts.length !== filteredContacts.length) {
    contacts = filteredContacts;
    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2));
    return { message: 'Contact deleted successfully', code: 200, contacts };
  } else {
    return { message: 'Contact not found', code: 404 };
  }
}

async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const newContact = { id: uuidv4(), name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function updateContactById(id, updateData) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(contact => contact.id === id);
  if (contactIndex === -1) {
    return null;
  }
  contacts[contactIndex] = { ...contacts[contactIndex], ...updateData };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[contactIndex];
}

module.exports = { listContacts, getContactById, removeContact, addContact, updateContactById };

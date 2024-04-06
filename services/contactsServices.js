const mongoose = require('mongoose');
const Contact = require('../models/contactModel.js');

async function listContacts() {
  try {
    const contacts = await Contact.find({});
    console.log('Contacts retrieved successfully:', contacts);
    return contacts;
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    throw error;
  }
}

async function getContactById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId');
  }
  const contact = await Contact.findById(id);

  if (!contact) {
    throw new Error('Contact not found');
  }

  return contact;
}

async function removeContact(contactId) {
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  if (!deletedContact) {
    return { code: 404, message: 'Contact not found' };
  }
  return { code: 200, message: 'Contacts deleted successfully', contact: deletedContact };
}

async function addContact({ name, email, phone }) {
  const newContact = new Contact({ name, email, phone });
  await newContact.save();
  return newContact;
}

async function updateContactById(id, updateData) {
  //
  const updateContact = await Contact.findByIdAndUpdate(id, updateData, { new: true });
  return updateContact;
}

async function updateStatusContact(contactId, body) {
  const { favorite } = body;
  const updateContact = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
  return updateContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
  updateStatusContact,
};

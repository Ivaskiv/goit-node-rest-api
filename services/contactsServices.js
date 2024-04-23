//contactsServices.js
const mongoose = require('mongoose');
const Contact = require('../models/contactModel.js');
const HttpError = require('../helpers/HttpError.js');

async function listContacts(userId) {
  try {
    const contacts = await Contact.find({ owner: userId });
    console.log('Contacts retrieved successfully');
    return contacts;
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    throw error;
  }
}

async function getContactById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Error('Invalid contact ID');
  }
  const contact = await Contact.findById(id);

  if (!contact) {
    throw Error('Not found');
  }

  return contact;
}

async function removeContact(id) {
  const deletedContact = await Contact.findByIdAndDelete(id);
  if (!deletedContact) {
    throw HttpError(404, 'Contact not found');
  }
  return deletedContact;
}

async function addContact(contactData) {
  if (Object.keys(contactData).length === 0) {
    throw Error('Body must have at least one field');
  }
  const newContact = new Contact(contactData);
  await newContact.save();
  return newContact;
}

async function updateContactById(id, updateData) {
  if (Object.keys(updateData).length === 0) {
    throw Error('Body must have at least one field');
  }
  const contact = await Contact.findById(id);
  if (!contact) {
    throw HttpError(404, 'Not found');
  }
  const updateContact = await Contact.findByIdAndUpdate(id, updateData, { new: true });
  return updateContact;
}

async function updateStatusContact(contactId, body) {
  const { favorite } = body;
  if (favorite === undefined) throw HttpError(400, 'Favorite status must be provided');
  const updateContact = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
  if (!updateContact) {
    throw Error('Not found');
  }
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

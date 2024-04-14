//contactsServices.js
const mongoose = require('mongoose');
const Contact = require('../models/contactModel.js');
const {
  updateContactSchema,
  createContactSchema,
  updateFavoriteSchema,
} = require('../schemas/contactsSchemas.js');
const { validateBody } = require('../helpers/validateBody.js');

async function listContacts() {
  try {
    const contacts = await Contact.find({});
    console.log('Contacts retrieved successfully');
    return contacts;
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    throw error;
  }
}

async function getContactById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid contact ID');
  }
  const contact = await Contact.findById(id);

  if (!contact) {
    throw Error('Not found');
  }

  return contact;
}

async function removeContact(contactId) {
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  if (!deletedContact) {
    return { code: 404, message: 'Not found' };
  }
  return { code: 200, message: 'Contacts deleted successfully', contact: deletedContact };
}

async function addContact(contactData) {
  validateBody(contactData, createContactSchema);
  const newContact = new Contact(contactData);
  await newContact.save();
  return newContact;
}

async function updateContactById(id, updateData) {
  if (Object.keys(updateData).length === 0) {
    throw Error('Body must have at least one field');
  }
  validateBody(updateData, updateContactSchema);
  const contact = await Contact.findById(id);
  if (!contact) {
    throw new HttpError(404, 'Not found');
  }
  const updateContact = await Contact.findByIdAndUpdate(id, updateData, { new: true });
  return updateContact;
}

async function updateStatusContact(contactId, body) {
  const { favorite } = body;
  if (favorite === undefined) throw HttpError(400, 'Favorite status must be provided');
  validateBody(body, updateFavoriteSchema);
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

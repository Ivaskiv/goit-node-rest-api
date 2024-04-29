//middleware checkContactOwnership - для перевірки,
//чи користувач є власником контакту перед виконанням
//операцій над контактом

//getContactAndcheckContactOwnership.js
const mongoose = require('mongoose');
const contactsService = require('../services/contactsServices.js');
const { errorWrapper } = require('../helpers/errorWrapper.js');

const getContactAndCheckContactOwnership = errorWrapper(async (req, res, next) => {
  const userId = req.user._id;
  const contactId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next({ status: 400, message: 'Invalid contact ID' });
  }

  const contact = await contactsService.getContactById(contactId);

  if (!contact) {
    return next({ status: 404, message: 'Contact not found' });
  }

  if (!contact.owner || !contact.owner.equals(userId)) {
    return next({ status: 403, message: 'Not authorized' });
  }
  //додати контакт до об'єкта запиту для подальшого використання
  req.contact = contact;
  next();
});

module.exports = getContactAndCheckContactOwnership;

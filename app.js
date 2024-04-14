//app.js
const mongoose = require('mongoose');
const Contact = require('./models/contactModel.js');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const contactsRouter = require('./routes/contactsRouter');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log(`Database connection successful... Server is started on the port ${PORT}`);

    const contacts = await Contact.find({});
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });

if (process.env.Node_ENV === 'development') {
  app.use(morgan('dev'));
}

app.listen(PORT, () => {
  console.log('Server is running');
});

app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Server error' });
// });
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

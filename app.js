//app.js
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const contactsRouter = require('./routes/contactsRouter');
const userRouter = require('./routes/userRouter.js');
const { authToken } = require('./middleware/authToken.js');
const { loginUser } = require('./controllers/userControllers.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log(`Database connection successful... Server is started on the port ${PORT}`);
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

app.use(express.static('public'));

// реєстрація маршруту для створення / оновлення токену
app.post('/api/login', loginUser);

app.use('/api/users', userRouter);

// використання middleware для перевірки токену перед доступом до захищених маршрутів
app.use('/api/contacts', authToken, contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

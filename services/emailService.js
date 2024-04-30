// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const { MAILTRAP_PASSWORD, BASE_URL, MAILTRAP_USER, MAILTRAP_EMAIL_USER } = process.env;
// створення транспортера
const transporter = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASSWORD,
  },
});

//!Крок 3: Відправка email користувачу з посиланням для верифікації
// відправлення листа з посиланням для верифікації email
const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${BASE_URL}/api/users/verify/${verificationToken}`;
  try {
    const emailOptions = {
      from: MAILTRAP_EMAIL_USER,
      to: email,
      subject: 'Confirm your email address',
      html: `<div>
        <p>Dear User,</p>
        <p>Thank you for signing up for an account</p>
        <p>To complete your registration, please click on the link below:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      </div>`,
    };
    console.log('Verification email sent');

    const info = await transporter.sendMail(emailOptions);
    console.log('Email sent:', info);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};

module.exports = { sendVerificationEmail, transporter };

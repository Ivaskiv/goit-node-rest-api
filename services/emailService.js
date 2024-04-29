// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const { EMAIL_USER, EMAIL_PASSWORD, BASE_URL } = process.env;

// створення транспортера
const transporter = nodemailer.createTransport({
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

// відправлення листа з посиланням для верифікації email
const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${verificationToken}`;
  //!
  console.log('emailService', verificationLink);

  try {
    const emailOptions = {
      from: EMAIL_USER,
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

const express = require('express');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const dotenv = require('dotenv');
const { sql, pool } = require('../database/db');

dotenv.config();

const { EMAIL, PASSWORD } = process.env;

const codes = {};

const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  console.log('Received request to send email to:', email);

  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000);
  console.log('Type of Verification Code:', typeof code, 'Length:', code.length);
  try {
    // Save the code in your database where email matches
    const updateCodeQuery = 'UPDATE Users SET VerificationCode = @VerificationCode WHERE Email = @Email';
await pool.request()
  .input('Email', sql.NVarChar(255), email)
  .input('VerificationCode', sql.Int, code)
  .query(updateCodeQuery);


    // Send email with confirmation code
    sendConfirmationEmail(res, email, code);
  } catch (error) {
    console.error('Error updating verification code:', error);
    res.status(500).json({ error: 'Failed to update verification code. Please try again later.' });
  }
});

function sendConfirmationEmail(res, email, code) {
  // Ensure email is not empty or undefined
  if (!email) {
    console.error('Email is empty or undefined');
    return res.status(500).json({ error: 'Failed to send email. Email is empty or undefined.' });
  }
  let config = {
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'ChalkTrend',
      link: 'https://chalktrend.com/',
    },
  });

  let response = {
    body: {
      name: email,
      intro: 'Welcome to Your App! We\'re excited to have you on board.',
      action: [
        {
          instructions: 'Verification Code:',
          button: {
            color: '#FF78ADAD',
            text: code,
            bold: true,
          },
        },
      ],
      outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: email,
    subject: 'Email Verification',
    html: mail,
  };

  transporter.sendMail(message)
    .then(() => {
      console.log('Email sent successfully to:', email);
      res.status(201).json({ msg: 'You should receive an email.' });
    })
    .catch(error => {
      console.error('Failed to send email:', error);
      res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    });
}

module.exports = router;

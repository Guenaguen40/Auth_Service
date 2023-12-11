const express = require('express');
const { sql, pool } = require('../database/db');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const dotenv = require('dotenv');

dotenv.config();

const { EMAIL, PASSWORD } = process.env;

const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    console.log(`Received forgot password request for: ${email}`);

    // Check if the email exists in your database
    const userResult = await pool
      .request()
      .input('Email', sql.NVarChar(255), email)
      .query('SELECT * FROM Users WHERE Email = @Email');

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send email with password reset link
    sendPasswordResetEmail(res, email);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

function sendPasswordResetEmail(res, email) {
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

  // Link to your reset password page
  let resetLink = `https://localhost:56114/#/resetpassword`;

  let response = {
    body: {
      name: email,
      intro: 'You have requested a password reset. Please click the link below to reset your password:',
      action: [
        {
          instructions: 'Reset Password',
          button: {
            color: '#FF78ADAD',
            text: 'Reset Password',
            link: resetLink,
          },
        },
      ],
      outro: 'If you did not request this, please ignore this email.',
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: email,
    subject: 'Password Reset Request',
    html: mail,
  };

  transporter.sendMail(message)
    .then(() => {
      console.log('Password reset email sent successfully to:', email);
      res.status(200).json({ msg: 'You should receive an email with a password reset link.' });
    })
    .catch(error => {
      console.error('Failed to send password reset email:', error);
      res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    });
}

module.exports = router;

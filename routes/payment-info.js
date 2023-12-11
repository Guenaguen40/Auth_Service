const express = require('express');
const { sql, pool } = require('../database/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, cardholderName, cardNumber, expirationDate, cvv } = req.body;

  try {
    console.log(`Received payment details for user with email: ${email}`);

    // Check if the email exists in the Users table
    const checkEmailQuery = 'SELECT UserId FROM Users WHERE Email = @Email';
    const { recordset } = await pool.request().input('Email', sql.NVarChar(255), email).query(checkEmailQuery);

    const userId = recordset[0]?.UserId;

    if (!userId) {
      return res.status(400).json({ error: 'User not found with the provided email' });
    }

    // Insert into PaymentDetails table
    const insertPaymentDetailsQuery = `
      INSERT INTO PaymentDetails (UserId, CardholderName, CardNumber, ExpirationDate, CVV)
      VALUES (@UserId, @CardholderName, @CardNumber, @ExpirationDate, @CVV);
    `;

    await pool.request()
      .input('UserId', sql.Int, userId)
      .input('CardholderName', sql.VarChar(255), cardholderName)
      .input('CardNumber', sql.VarChar(255), cardNumber)
      .input('ExpirationDate', sql.Date, expirationDate)
      .input('CVV', sql.VarChar(255), cvv)
      .query(insertPaymentDetailsQuery);

    res.status(201).json({ message: 'Payment details added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

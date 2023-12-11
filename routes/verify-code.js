const express = require('express');
const { sql, pool } = require('../database/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, code } = req.body;

  try {
    // Retrieve the stored code for the given email from the database
    const getCodeQuery = 'SELECT VerificationCode FROM Users WHERE Email = @Email';
    const result = await pool.request()
      .input('Email', sql.NVarChar(255), email)
      .query(getCodeQuery);

    if (result.recordset.length > 0) {
      const storedCode = result.recordset[0].VerificationCode;

      if (storedCode && storedCode === parseInt(code)) {
        // Code is valid
        // You may want to update the database to mark the email as verified if needed
        const updateVerificationQuery = 'UPDATE Users SET IsVerified = 1 WHERE Email = @Email';
        await pool.request()
          .input('Email', sql.NVarChar(255), email)
          .query(updateVerificationQuery);

        res.json({ message: 'Code verified successfully' });
      } else {
        // Code is invalid
        res.status(400).json({ error: 'Invalid code' });
      }
    } else {
      // Email not found
      res.status(404).json({ error: 'Email not found' });
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ error: 'Failed to verify code. Please try again later.' });
  }
});

module.exports = router;

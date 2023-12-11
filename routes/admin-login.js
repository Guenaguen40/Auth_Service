const express = require('express');
const { sql, pool } = require('../database/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Received login request: ${email}, ${password}`);

    // Execute the login query
    const result = await pool
      .request()
      .input('Email', sql.NVarChar(255), email)
      .input('Password', sql.NVarChar(255), password)
      .query('SELECT * FROM Admin WHERE Email = @Email AND Password = @Password');

    // Check if the user exists and the password is correct
    if (result.recordset.length > 0) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

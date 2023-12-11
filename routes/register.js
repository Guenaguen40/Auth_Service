const express = require('express');
const { sql, pool } = require('../database/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password, usertype } = req.body;

  try {
    console.log(`Received registration request: ${email}, ${password}, ${usertype}`);

    // Check if the email already exists
    const checkEmailQuery = 'SELECT COUNT(*) AS count FROM Users WHERE Email = @Email';
    const { recordset } = await pool.request().input('Email', sql.NVarChar(255), email).query(checkEmailQuery);

    if (recordset[0].count > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Execute the registration query
    const insertUserQuery = 'INSERT INTO Users (Email, PasswordHash, UserType) VALUES (@Email, @Password, @UserType)';
    await pool.request().input('Email', sql.NVarChar(255), email)
      .input('Password', sql.NVarChar(255), password)
      .input('UserType', sql.NVarChar(255), usertype)
      .query(insertUserQuery);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

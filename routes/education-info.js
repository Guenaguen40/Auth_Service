const express = require('express');
const { sql, pool } = require('../database/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, degreeName, schoolName, graduationYear } = req.body;

  try {
    console.log(`Received education information for user with email: ${email}`);

    // Check if the email exists in the Users table
    const checkEmailQuery = 'SELECT UserId FROM Users WHERE Email = @Email';
    const { recordset } = await pool.request().input('Email', sql.NVarChar(255), email).query(checkEmailQuery);

    const userId = recordset[0]?.UserId;

    if (!userId) {
      return res.status(400).json({ error: 'User not found with the provided email' });
    }

    // Insert into Education table
    const insertEducationQuery = `
      INSERT INTO Education (UserId, DegreeName, SchoolName, GraduationYear)
      VALUES (@UserId, @DegreeName, @SchoolName, @GraduationYear);
    `;

    await pool.request()
      .input('UserId', sql.Int, userId)
      .input('DegreeName', sql.NVarChar(255), degreeName)
      .input('SchoolName', sql.NVarChar(255), schoolName)
      .input('GraduationYear', sql.Int, graduationYear)
      .query(insertEducationQuery);

    res.status(201).json({ message: 'Education information added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

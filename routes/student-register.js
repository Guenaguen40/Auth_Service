const express = require('express');
const { sql, pool } = require('../database/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, academicInfo, country, city, address, zipCode, aboutSection } = req.body;

  try {
    console.log(`Received student registration request for: ${email}`);

    // Check if the email exists in the Users table
    const checkEmailQuery = 'SELECT UserId FROM Users WHERE Email = @Email';
    const { recordset } = await pool.request().input('Email', sql.NVarChar(255), email).query(checkEmailQuery);

    const userId = recordset[0]?.UserId;

    if (!userId) {
      return res.status(400).json({ error: 'User not found with the provided email' });
    }

    // Insert into Students table
    const insertStudentQuery = `
      INSERT INTO Students (UserId, AcademicInfo, Country, City, Address, ZipCode, AboutSection)
      VALUES (@UserId, @AcademicInfo, @Country, @City, @Address, @ZipCode, @AboutSection);
    `;

    await pool.request()
      .input('UserId', sql.Int, userId)
      .input('AcademicInfo', sql.NVarChar(255), academicInfo)
      .input('Country', sql.NVarChar(255), country)
      .input('City', sql.NVarChar(255), city)
      .input('Address', sql.NVarChar(255), address)
      .input('ZipCode', sql.NVarChar(255), zipCode)
      .input('AboutSection', sql.NVarChar(255), aboutSection)
      .query(insertStudentQuery);

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

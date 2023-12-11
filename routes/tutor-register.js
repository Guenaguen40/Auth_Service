const express = require('express');
const { sql, pool } = require('../database/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, paymentType, profileSection, academicLevel, country, city, address, zipCode, payPerHourRate, availabilitiesPerWeek } = req.body;

  try {
    console.log(`Received tutor registration request for: ${email}`);

    // Check if the email exists in the Users table
    const checkEmailQuery = 'SELECT UserId FROM Users WHERE Email = @Email';
    const { recordset } = await pool.request().input('Email', sql.NVarChar(255), email).query(checkEmailQuery);

    const userId = recordset[0]?.UserId;

    if (!userId) {
      return res.status(400).json({ error: 'User not found with the provided email' });
    }

    // Insert into Tutor table
    const insertTutorQuery = `
      INSERT INTO Tutors (UserId, PaymentType, ProfileSection, AcademicLevel, Country, City, Address, ZipCode, PayPerHourRate, AvailabilitiesPerWeek)
      VALUES (@UserId, @PaymentType, @ProfileSection, @AcademicLevel, @Country, @City, @Address, @ZipCode, @PayPerHourRate, @AvailabilitiesPerWeek);
    `;

    await pool.request()
      .input('UserId', sql.Int, userId)
      .input('PaymentType', sql.NVarChar(255), paymentType)
      .input('ProfileSection', sql.NVarChar(255), profileSection)
      .input('AcademicLevel', sql.NVarChar(255), academicLevel)
      .input('Country', sql.NVarChar(255), country)
      .input('City', sql.NVarChar(255), city)
      .input('Address', sql.NVarChar(255), address)
      .input('ZipCode', sql.NVarChar(255), zipCode)
      .input('PayPerHourRate', sql.Decimal(18, 2), payPerHourRate)
      .input('AvailabilitiesPerWeek', sql.Int, availabilitiesPerWeek)
      .query(insertTutorQuery);

    res.status(201).json({ message: 'Tutor registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

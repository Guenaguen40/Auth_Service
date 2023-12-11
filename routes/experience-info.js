const express = require('express');
const { sql, pool } = require('../database/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, postName, companyName, startedWhen, finishedWhen, description } = req.body;

  try {
    console.log(`Received professional experience information for user with email: ${email}`);

    // Check if the email exists in the Users table
    const checkEmailQuery = 'SELECT UserId FROM Users WHERE Email = @Email';
    const { recordset } = await pool.request().input('Email', sql.NVarChar(255), email).query(checkEmailQuery);

    const userId = recordset[0]?.UserId;

    if (!userId) {
      return res.status(400).json({ error: 'User not found with the provided email' });
    }

    // Insert into ProfessionalExperience table
    const insertExperienceQuery = `
      INSERT INTO ProfessionalExperience (UserId, PostName, CompanyName, StartedWhen, FinishedWhen, Description)
      VALUES (@UserId, @PostName, @CompanyName, @StartedWhen, @FinishedWhen, @Description);
    `;

    await pool.request()
      .input('UserId', sql.Int, userId)
      .input('PostName', sql.NVarChar(255), postName)
      .input('CompanyName', sql.NVarChar(255), companyName)
      .input('StartedWhen', sql.Date, startedWhen)
      .input('FinishedWhen', sql.Date, finishedWhen)
      .input('Description', sql.NVarChar(255), description)
      .query(insertExperienceQuery);

    res.status(201).json({ message: 'Professional experience information added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
      const pool = await poolConnect;
      const result = await pool.request()
        .input('Username', username)
        .input('Email', email)
        .input('Password', password)
        .query('INSERT INTO Users (Username, Email, Password) VALUES (@Username, @Email, @Password)');
      
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
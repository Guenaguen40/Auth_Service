const sql = require('mssql');
const config = {
    user: 'Guenaguen',
    password: 'Soumaya4000',
    server: 'soumayaguenaguen.database.windows.net',
    port: 1433,
    database: 'chalktrendbs',
    authentication: { type: 'default' },
    options: { encrypt: true }
};

// Create a new connection pool
const pool = new sql.ConnectionPool(config);

// Connect to the database
pool.connect()
    .then(() => console.log('Connected to the database'))
    .catch(error => console.error('Error connecting to the database:', error));

// Export the sql and pool objects for use in other files
module.exports = {
    sql,
    pool
};

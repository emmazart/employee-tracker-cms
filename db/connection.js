var mysql = require('mysql2');

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root', // your MySQL username
        password: '', // your MySQL password
        database: 'company'
    },
    console.log('Connected to the company database.')
);

module.exports = db;
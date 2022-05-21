const express = require('express');
const db = require('./db/connection');
const inputCheck = require('./utils/inputCheck');

// instantiate the server
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false })) // parse incoming string or array data
app.use(express.json()); // parse incoming json data

app.get('/api/department', (req, res) => {
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});


// Catchall 
app.use((req, res) => {
    res.sendStatus(404).end();
});

// start server after db connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
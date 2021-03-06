const express = require('express');
const db = require('./db/connection');
const routes = require('./routes');

// instantiate the server
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false })) // parse incoming string or array data
app.use(express.json()); // parse incoming json data

// turn on routes
app.use('/', routes);

// start server after db connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
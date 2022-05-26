const router = require('express').Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');


// get all departments  /api/departments
router.get('/', (req, res) => {
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

// create a new department /api/departments 
router.post('/', ({ body }, res) => {
    // const errors = inputCheck(body, 'name');
    // if (errors) {
    //     res.status(400).json({ error: errors });
    // }
    const sql = `INSERT INTO department (name) VALUES(?)`;
    const params = [body.name];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

module.exports = router;
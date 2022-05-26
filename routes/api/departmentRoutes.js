const router = require('express').Router();
const req = require('express/lib/request');
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

// get a single department   /api/departments/:id
router.get('/:id', (req, res) => {
    const sql = `SELECT * FROM department WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// delete a department  /api/departments/:id
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM department WHERE id =?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Department not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// update a department name  /api/departments/:id
router.put('/:id', (req, res) => {
    const sql = `UPDATE department SET name = ? WHERE id = ?`;
    const params = [req.body.name, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) { // check for errors
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) { // check to see if any rows have been affected
            res.json({
                message: 'Department not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
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
const router = require('express').Router();
const db = require('../../db/connection');
const store = require('../../db/store') // import helper class


// get all employees  /api/employees
router.get('/', (req, res) => {
    const sql = store.findAll('employee');

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

// get a single employee   /api/employees/:id
router.get('/:id', (req, res) => {
    const sql = store.findOne('employee');
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

// delete an employee  /api/employees/:id
router.delete('/:id', (req, res) => {
    const sql = store.deleteOne('employee');
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Employee not found'
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

// create a new employee  /api/employees
router.post('/', ({ body}, res) => {
    const sql = store.createOne('employee');
    const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

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

// update an employee   /api/employees/:id
router.put('/:id', (req, res) => {
    const sql = store.updateRole('employee');
    const params = [req.body.role_id, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Employee not found'
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

module.exports = router;
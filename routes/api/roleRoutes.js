const router = require('express').Router();
const req = require('express/lib/request'); // why does this automatically pop up?
const db = require('../../db/connection');
const store = require('../../db/store') // import helper class


// get all roles  /api/roles
router.get('/', (req, res) => {
    const sql = store.findAll('role');

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

// get a single role   /api/roles/:id
router.get('/:id', (req, res) => {
    const sql = store.findOne('role');
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

// delete a role   /api/roles/:id
router.delete('/:id', (req, res) => {
    const sql = store.deleteOne('role');
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message })
        } else if (!result.affectedRows) {
            res.json({
                message: 'Role not found'
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

// update a role salary   /api/roles/:id
router.put('/:id', (req, res) => {
    const sql = store.updateOne('role');
    const params = [req.body.salary, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Role not found'
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

// create a new role  /api/roles
router.post('/', ({body}, res) => {
    const sql = store.createOne('role');
    const params = [body.title, body.name, body.department_id];

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
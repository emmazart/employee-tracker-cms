const db = require('../db/connection');

class Queries {

    // returns db promise for query based on table param passed through
    findAll(table) {
        if (table === 'employee') {
            return db.promise().query(
                `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager 
                FROM employee 
                LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id 
                LEFT JOIN employee manager ON manager.id = employee.manager_id`);
        } else if (table === 'department') {
            return db.promise().query(`SELECT * FROM ${table}`);
        } else if (table === 'role') {
            return db.promise().query(
                `SELECT role.id, role.title, department.name AS department, role.salary 
                FROM role 
                LEFT JOIN department ON role.department_id = department.id`);
        }
    }

    // takes in table name and returns sql query for SELECT
    // pass in id? choices index + 1?
    findOne(table) {
        return `SELECT * FROM ${table} WHERE id = ?`;
        // 
    }

    // takes in table name and returns sql query for DELETE
    deleteOne(table) {
        return `DELETE FROM ${table} WHERE id = ?`;
    }

    // takes in table name, checks for kind of table, returns sql query
    createOne(table, param1, param2, param3, param4) {
        if (table === 'employee') {
            return db.promise().query(`INSERT INTO ${table} (first_name, last_name, role_id, manager_id) VALUES(${param1},${param2},${param3},${param4})`);
        } else if (table === 'department') {
            return db.promise().query(
                `INSERT INTO ${table} (name) VALUES (${param1})`);
        } else if (table === 'role') {
            return db.promise().query( 
                `INSERT INTO ${table} (title, salary, department_id) VALUES(${param1},${param2},${param3})`);
        }
    }

    // takes in table name & returns update sql
    updateOne(table, param1, param2) {
        if (table === 'employee') {
            return db.promise().query(`UPDATE ${table} SET role_id = ${param2} WHERE id = ${param1}`);
        } else if (table === 'department') {
            return `UPDATE ${table} SET name = ? WHERE id = ?`;
        } else if (table === 'role') {
            return `UPDATE ${table} SET salary = ? WHERE id = ?`;
        }
    }

}

module.exports = new Queries();
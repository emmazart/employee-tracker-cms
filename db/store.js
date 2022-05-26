// put helper sql functions in here?

class Store {

    // takes in a table name & returns sql query for SELECT *
    findAll(table) {
        return `SELECT * FROM ${table}`;
    }

    // takes in table name and returns sql query for SELECT
    findOne(table) {
        return `SELECT * FROM ${table} WHERE id = ?`;
    }

    // takes in table name and returns sql query for DELETE
    deleteOne(table) {
        return `DELETE FROM ${table} WHERE id = ?`;
    }

    // takes in table name, checks for kind of table, returns sql query
    createOne(table) {
        if (table === 'employee') {
            return `INSERT INTO ${table} (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)`;
        } else if (table === 'department') {
            return `INSERT INTO department (name) VALUES(?)`;
        }
    }

    // takes in table name & returns update sql
    updateOne(table) {
        if (table === 'employee') {
            return `UPDATE ${table} SET role_id = ? WHERE id = ?`;
        } else if (table === 'department') {
            return `UPDATE ${table} SET name = ? WHERE id = ?`;
        }
    }

}

module.exports = new Store();
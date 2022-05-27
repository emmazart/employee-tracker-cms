const inquirer = require('inquirer');
const cTable = require('console.table');
const router = require('express').Router();
const db = require('./db/connection');
const store = require('./db/store') // import helper class

const department = require('./routes/api/departmentRoutes');

inquirer.prompt([
     // select initial action
     {
        name: 'typeofAction',
        message: 'What would you like to do?',
        type: 'rawlist', 
        choices: ['View all departments','View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update the role of an existing employee'],
        default: 0
    }
])
.then((answer) => {
    console.log(answer);

    // if (answer.typeofAction === 'View all departments'){
    //     console.log('hello');
    //     return async function queryHandler() {
    //         let results = await store.findAll('department');
    //         return results;
    //     }
    // }

    if (answer.typeofAction === 'View all departments'){
        console.log('hello');
        const sql = store.findAll('department')
        
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(sendStatus(500).json({ error: err.message }));
                    return;
                }
                console.table(rows);
            });
    }

})
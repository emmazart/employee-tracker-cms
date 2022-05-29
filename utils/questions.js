const db = require('../db/connection');
const queries = require('../db/queries');

var choices = [];

function findAllRoles() {
    queries.findAll('role')
    .then(([rows]) => {
        return rows;
    })
    // .then(([rows]) => {var choices = rows})          
}

const questions = { 
    
    newDeptQuestions: [
        {
            name: 'departmentName',
            message: 'Please enter a department name:',
            type: 'input',
            validate: departmentNameInput => {
                if (departmentNameInput) {
                    return true;
                } else {
                    console.log("Please enter a valid department name!")
                    return false;
                }
            }
    
        }
    ],
    newRoleQuestions: [
        {
            name: 'title',
            message: "Enter a title:",
            type: 'input'
        },
        {
            name: 'salary',
            message: "Enter the salary for this role (numbers only):",
            type: 'number'
        }
    ]
}

module.exports = questions;
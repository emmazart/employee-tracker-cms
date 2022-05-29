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
    newEmployeeQuestions: [
        {
            name: 'firstName',
            message: "Enter employee's first name:",
            type: 'input'
        },
        {
            name: 'lastName',
            message: "Enter employee's last name:",
            type: 'input'
        },
        // {
        //     name: 'role',
        //     message: "Select a role:",
        //     type: 'rawlist',
        //     choices: findAllRoles()

        // }
    ]

}

module.exports = questions;
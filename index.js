const { prompt } = require('inquirer');
const cTable = require('console.table');
const queries = require('./db/queries');
const { newDeptQuestions, newEmployeeQuestions} = require('./utils/questions');
const db = require('./db/connection');

const end = () => {
    console.log('Thank you, exiting application.');
    process.exit();
};

const menu = () => {

    prompt([
        {
            name: 'typeofAction',
            message: 'What would you like to do?',
            type: 'rawlist', 
            choices: ['View all departments','View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update the role of an existing employee', 'Quit'],
            default: 0
        }    
    ]).then(choice => {
        console.log(choice.typeofAction);
        switch(choice.typeofAction) {
            case 'View all departments':
                findAllFromTable('department'); // call function to handle
                break;
            case 'View all roles':
                findAllFromTable('role'); // call function to handle
                break;
            case 'View all employees':
                findAllFromTable('employee'); // call function to handle
                break;
            case 'Add a department':
                prompt(newDeptQuestions)
                .then((answer) => {
                    let newDept = JSON.stringify(answer.departmentName);
                    console.log(newDept)
                    addToTable('department', newDept);
                })            
                break;
            case 'Add a role':
                // call function to handle
                break;
            case 'Add an employee':
                addEmployee();
                // ----- WORKS FOR FIRST & LAST NAME but not role/manager ----- //
                // prompt(newEmployeeQuestions)
                // .then((answers) => {
                //     let firstName = JSON.stringify(answers.firstName);
                //     let lastName = JSON.stringify(answers.lastName);
                //     console.log(firstName + lastName);
                //     addToTable('employee', firstName, lastName, role, manager);
                // })
                break;
            case 'Update the role of an existing employee':
                updateRole(); // call function to handle
                break;
            default: 
                end();
                break;
        }
    });
};

function test() {
    console.log('PASSED');
    prompt(questions)
    .then((answer) => {
        let newDept = JSON.stringify(answer.departmentName);
        console.log(newDept)
        addToTable('department', newDept);
    })
};

function findAllFromTable(param) {
    queries.findAll(param)
    .then(([rows]) => {
        console.table(rows);
    })
    .then(() => menu());
};

function addEmployee() {
    prompt([
        {
            name: 'firstName',
            message: "Enter employee's first name:",
            type: 'input'
        },
        {
            name: 'lastName',
            message: "Enter employee's last name:",
            type: 'input'
        }
    ]).then((answers) => {
        let firstName = JSON.stringify(answers.firstName)
        let lastName = JSON.stringify(answers.lastName)

        db.query("SELECT id, title FROM role;", (err, rows) => {
            console.log(rows)
            const roles = rows.map((row) => {
                return { value: row.id, name: row.title }
            })
            prompt([
                {
                    name: 'roleChoices',
                    message: "Select a role:",
                    type: 'list',
                    choices: roles,
                }
            ]).then((answer) => {
                let role = answer.roleChoices
                console.log(role)
    
                db.query("SELECT id, first_name, last_name FROM employee;", (err, rows) => {
                    console.log(rows)
                    const managers = rows.map((row) => {
                        return { value: row.id, name: row.first_name + " " + row.last_name }
                    })
                    prompt([
                        {
                            name: 'managerChoices',
                            message: "Select a manager:",
                            type: 'list',
                            choices: managers,
                        }
                    ]).then((answer) => {
                        let manager = answer.managerChoices
                        console.log(manager)

                        addToTable('employee', firstName, lastName, role, manager);
                    })          
                }) 
            })
        })    
    })
};

function getAllChoices(param) {
    queries.findAll(param)
    .then(([rows]) => {
        console.log(rows);
    })
    // .then(() => menu());
}

function updateRole() {
    queries.findAll('role')
    .then(([rows]) => {
        console.log(rows.title)
        prompt([
            {
                name: 'test',
                message: 'test',
                type: 'input'
            },
            // {
            //     name: 'newRole',
            //     message: 'Select a new role:',
            //     type: 'rawlist', 
            //     choices: rows
            // }
        ])
    })
}

function addToTable(table, param1, param2, param3, param4) {
    queries.createOne(table, param1, param2, param3, param4)
    .then((result) => console.log('Affected Rows:' + result[0].affectedRows));
}

menu(); 
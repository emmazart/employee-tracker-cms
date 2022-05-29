const { prompt } = require('inquirer');
const cTable = require('console.table');
const queries = require('./db/queries');
const { newDeptQuestions, newRoleQuestions} = require('./utils/questions');
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
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
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

// ---------- FUNCTION FOR VIEWING TABLE CHOICES ---------- //
function findAllFromTable(param) {
    queries.findAll(param) // calls methods in queries.js
    .then(([rows]) => {
        console.table(rows);
    })
    .then(() => menu());
};

// ---------- DECLARE FUNCTION FOR ADDING A NEW EMPLOYEE ---------- //
function addEmployee() {
    // PROMPT FOR NEW EMPLOYEE FIRST & LAST NAME
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
        // STORE FIRST & LAST NAME ANSWERS AS STRINGS
        let firstName = JSON.stringify(answers.firstName)
        let lastName = JSON.stringify(answers.lastName)

        // SEND DB QUERY FOR ROLE OPTIONS
        db.query("SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id;", (err, rows) => {
            const roles = rows.map((row) => {
                return { value: row.id, name: row.title + ", " + row.department + " (Salary: " + row.salary + ")" }
            })
            prompt([
                {
                    name: 'roleChoices',
                    message: "Select a role:",
                    type: 'list',
                    choices: roles,
                }
            ]).then((answer) => {
                // STORE ROLE ANSWER
                let role = answer.roleChoices
    
                // SEND DB QUERY FOR MANAGER OPTIONS
                db.query("SELECT id, first_name, last_name FROM employee;", (err, rows) => {
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
                        // STORE MANAGER ANSWER
                        let manager = answer.managerChoices
                        console.log(manager)

                        // CALL FUNCTION AND PASS IN ALL NECESSARY PARAMS
                        addToTable('employee', firstName, lastName, role, manager);
                    })          
                }) 
            })
        })    
    })
};

function addRole() {
    // PROMPT FOR NEW ROLE TITLE & SALARY
    prompt(newRoleQuestions).then((answers) => {
        // STORE TITLE & SALARY ANSWERS
        let title = JSON.stringify(answers.title)
        let salary = answers.salary

        // SEND DB QUERY FOR DEPARTMENT OPTIONS
        db.query("SELECT * FROM department;", (err, rows) => {
            const departments = rows.map((row) => {
                return { value: row.id, name: row.name }
            })
            prompt([
                {
                    name: 'deptChoices',
                    message: "Select a department:",
                    type: 'list',
                    choices: departments,
                }
            ]).then((answer) => {
                // STORE ROLE ANSWER
                let department = answer.deptChoices

                addToTable('role', title, salary, department);

            });
        });
    });
};

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
function updateRole() {
    // SEND DB QUERY FOR EMPLOYEE OPTIONS
    db.query("SELECT * FROM employee;", (err, rows) => {
        const employees = rows.map((row) => {
            return { value: row.id, name: row.first_name + " " + row.last_name}
        })
        prompt([
            {
                name: 'employeeChoices',
                message: 'Select an employee to update:',
                type: 'list',
                choices: employees,   
            }
        ]).then((answer) => {
            // STORE EMPLOYEE ANSWER
            let employee = answer.employeeChoices

            // SEND DB QUERY FOR ROLE OPTIONS
            db.query("SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id;", (err, rows) => {
                const roles = rows.map((row) => {
                    return { value: row.id, name: row.title + ", " + row.department + " (Salary: " + row.salary + ")" }
                })

                prompt([
                    {
                        name: 'roleChoices',
                        message: "Select a new role:",
                        type: 'list',
                        choices: roles,
                    }
                ]).then((answer) => {
                    // STORE ROLE ANSWER
                    let role = answer.roleChoices

                    // SEND DB QUERY FOR BOTH PARAMS
                    queries.updateOne('employee', employee, role)
                    .then((result) => {
                        console.log('Affected Rows: ' + result[0].affectedRows)
                        menu();
                    });                
        
                });
            });
        });
    });
};

// ---------- FUNCTION TAKES IN NECESSARY PARAMS AND SENDS TO METHODS IN QUERIES.JS ---------- //
function addToTable(table, param1, param2, param3, param4) {
    queries.createOne(table, param1, param2, param3, param4) // calls methods in queries.js
    .then((result) => {
        console.log('Affected Rows: ' + result[0].affectedRows)
        menu();
    });
}

menu(); 
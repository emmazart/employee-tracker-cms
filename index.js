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
            type: 'list', 
            choices: 
                ['VIEW all departments',
                'VIEW all roles', 
                'VIEW all employees', 
                'VIEW employees by department',
                'ADD a department', 
                'ADD a role', 
                'ADD an employee', 
                'UPDATE employee',
                'DELETE a department',
                'DELETE a role',
                'DELETE an employee', 
                'QUIT'],
        }    
    ]).then(choice => {
        switch(choice.typeofAction) {
            case 'VIEW all departments':
                findAllFromTable('department'); // call function to handle
                break;
            case 'VIEW all roles':
                findAllFromTable('role'); // call function to handle
                break;
            case 'VIEW all employees':
                findAllFromTable('employee'); // call function to handle
                break;
            case 'VIEW employees by department':
                findByDepartment();
                break;
            case 'ADD a department':
                prompt(newDeptQuestions)
                .then((answer) => {
                    let newDept = JSON.stringify(answer.departmentName);
                    addToTable('department', newDept);
                })            
                break;
            case 'ADD a role':
                addRole();
                break;
            case 'ADD an employee':
                addEmployee();
                break;
            case 'UPDATE employee':
                updateEmployee();
                break;
            case 'DELETE a department':
                deleteById('department');
                break;
            case 'DELETE a role':
                deleteRole();
                break;
            case 'DELETE an employee':
                deleteEmployee();
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

function updateEmployee() {
    prompt([
        {
            name: 'action',
            message: 'What would you like to do?',
            type: 'list',
            choices: ['Update employee role', 'Update employee manager', 'Main Menu']
        }
    ]).then(choice => {
        switch(choice.action) {
            case 'Update employee role':
                updateRole();
                break;
            case 'Update employee manager':
                updateManager();
                break;
            case 'Main Menu':
                menu();
                break;
        }   
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

function updateManager() {
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
    
                // SEND DB QUERY FOR MANAGER OPTIONS
                db.query(
                    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager 
                    FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id 
                    LEFT JOIN employee manager ON manager.id = employee.manager_id
                    WHERE INSTR(role.title, 'manager');`, 
                    (err, rows) => {
                    const managers = rows.map((row) => {
                        return { value: row.id, name: row.first_name + " " + row.last_name + ", " + row.department }
                    })
    
                    prompt([
                        {
                            name: 'managerChoices',
                            message: "Select a new manager:",
                            type: 'list',
                            choices: managers,
                        }
                    ]).then((answer) => {
                        // STORE ROLE ANSWER
                        let newManager = answer.managerChoices
    
                        // SEND DB QUERY FOR BOTH PARAMS
                        queries.updateManager('employee', employee, newManager)
                        .then((result) => {
                            console.log('Affected Rows: ' + result[0].affectedRows)
                            menu();
                        });                
            
                    });
                });
            });
        });
    
}

// ---------- FUNCTION DELETE FROM DEPARTMENT TABLE BY PRIMARY KEY ID ---------- //
function deleteById(table) {
    // SEND DB QUERY FOR TABLE OPTIONS
    db.query(`SELECT * FROM ${table};`, (err, rows) => {
        const options = rows.map((row) => {
            return { value: row.id, name: row.name }
        })
        prompt([
            {
                name: 'deleteItem',
                message: 'Select the department you would like to delete:',
                type: 'list',
                choices: options,
            }
        ]).then((answer) => {
            // SEND DB QUERY FOR DELETING ITEM
            queries.deleteOne(table, answer.deleteItem)
            .then((result) => {
                console.log('Department deleted. (Affected Rows: ' + result[0].affectedRows + ")")
                menu();
            });                

        })
    })
}

function deleteRole(table) {
    // SEND DB QUERY FOR TABLE OPTIONS
    db.query(`SELECT * FROM role;`, (err, rows) => {
        const options = rows.map((row) => {
            return { value: row.id, name: row.title }
        })
        prompt([
            {
                name: 'deleteItem',
                message: 'Select the role you would like to delete:',
                type: 'list',
                choices: options,
            }
        ]).then((answer) => {
            // SEND DB QUERY FOR DELETING ITEM
            queries.deleteOne('role', answer.deleteItem)
            .then((result) => {
                console.log('Role deleted. (Affected Rows: ' + result[0].affectedRows + ")")
                menu();
            });                

        })
    })
}

function deleteEmployee() {
    // SEND DB QUERY FOR TABLE OPTIONS
    db.query(`SELECT * FROM employee;`, (err, rows) => {
        const options = rows.map((row) => {
            return { value: row.id, name: row.first_name + " " + row.last_name }
        })
        prompt([
            {
                name: 'deleteItem',
                message: 'Select the employee you would like to delete:',
                type: 'list',
                choices: options,
            }
        ]).then((answer) => {
            // SEND DB QUERY FOR DELETING ITEM
            queries.deleteOne('employee', answer.deleteItem)
            .then((result) => {
                console.log('Employee deleted. (Affected Rows: ' + result[0].affectedRows + ")")
                menu();
            });                

        })
    })
}

function findByDepartment() {
    // get list of all current departments & grab id for that department
    db.query(`SELECT * FROM department;`, (err, rows) => {
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
            // STORE DEPARTMENT ANSWER
            let department = answer.deptChoices

            queries.findByDepartment(department)
            .then(([rows]) => {
                console.table(rows)
            })
            .then(() => menu());
        })
    })
}

// ---------- FUNCTION TAKES IN NECESSARY PARAMS AND SENDS TO METHODS IN QUERIES.JS ---------- //
function addToTable(table, param1, param2, param3, param4) {
    queries.createOne(table, param1, param2, param3, param4) // calls methods in queries.js
    .then((result) => {
        console.log('Affected Rows: ' + result[0].affectedRows)
        menu();
    });
}

function init(){
    menu(); 
}

init();

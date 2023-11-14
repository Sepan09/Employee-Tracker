const inquirer = require("inquirer");
const { writeFile } = require("fs/promises");
const fs = require('fs')


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'Employees_db'
    },
)


const mainMenu = () => {
    inquirer
        .prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do? (Use arrow keys)',
            choices: []
        },
        ])
    

        mainMenu();
};

mainMenu();
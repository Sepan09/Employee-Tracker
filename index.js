const inquirer = require("inquirer");
const { writeFile } = require("fs/promises");
const fs = require("fs");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "Employees_db",
});

const mainMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do? (Use arrow keys)",
        choices: [
          "view all employees",
          "view all roles",
          "view all departments",
          "add employee",
          "add department",
          "add role",
          "update employee role",
          "QUIT",
        ],
      },
    ])
    .then((answers) => {
      console.log(answers.choice);
      switch (answers.choice) {
        case "view all employees":
          viewEmployees();
          break;

        case "view all roles":
        viewRoles();
        break;

        case "view all departments":
          viewDepartments();
          break;

        case "add employee":
          addEmployee();
          break;

        case "add department":
          addDepartment();
          break;

        case "add role":
          addRole();
          break;

        case "update employee role":
          updateEmployeeRole();
          break;

        default:
          connection.end();
          break;
      }
    });
};

viewEmployees = () => {
  db.query(`SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, CONCAT(manager.first_name," ", manager.last_name) AS manager FROM employee JOIN employee manager ON manager.id = employee.manager_id`, (err, data) => {
    console.table(data);
    mainMenu();
  });
};

viewRoles = () => {
    db.query("SELECT role.id, role.title, role.department_id, role.salary FROM role", (err, data) => {
      console.table(data);
      mainMenu();
    });
  };

viewDepartments = () => {
  db.query("SELECT * FROM department", (err, data) => {
    console.table(data);
    mainMenu();
  });
};

const addEmployee = async () => {
    const roleData = await db.promise().query("SELECT * FROM role")
    const roleArr = roleData[0].map(role =>({name: role.title, value: role.id}));
    const employeeData = await db.promise().query("SELECT * FROM employee")
    const employeeArr = employeeData[0].map(employee => ({name: `${employee.first_name} ${employee.last_name}`,value: employee.id }))

  inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employees first name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employees last name?",
    },
    {
      type: "list",
      name: "role_id",
      message: "What is the employee's role?",
      choices: roleArr
    },
    {
      type: "list",
      name: "manager_id",
      message: "What is the employee's manager?",
      choices: employeeArr
    },
  ]).then((answers) => {
    db.query("INSERT INTO employee SET ?", answers, (err, data) => {
        console.log("employee added");
        mainMenu();
    })
  })  
};

const addDepartment = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the department that you want to add?",
    },
  ])
  db.query("INSERT INTO department SET ?", answers, (err, data) => {
    console.log('added Employee');
    mainMenu();
  })
};

const addRole = async() => {
    const departmentData = await db.promise().query("SELECT * FROM department")
    const departmentArr = departmentData[0].map(department =>({name: department.name}));
  inquirer.prompt([
    {
      message: "What is the name of the role?",
      type: "input",
      name: "role",
    },
    {
      message: "What is the salary of the role?",
      type: "number",
      name: "salary",
    },
    {
      message: "Which department does the role belong to? (Use arrow keys)",
      type: "list",
      name: "department_role",
      choices: departmentArr
    },
  ]).then((answers) => {
    db.query("INSERT INTO role SET ?", answers, (err, data) => {
        console.log("added Role");
        mainMenu();
    })
  })
};

const updateEmployeeRole = async () => {
    const roleData = await db.promise().query("SELECT * FROM role")
    const roleArr = roleData[0].map(role =>({name: role.title, value: role.id}));
    const employeeData = await db.promise().query("SELECT * FROM employee")
    const employeeArr = employeeData[0].map(employee => ({name: `${employee.first_name} ${employee.last_name}`,value: employee.id }))

  inquirer.prompt([
    {
      message: "which employee would you like to update? (use arrow keys)",
      type: "list",
      name: "name",
      choices: employeeArr
    },
    {
      message:
        "Which role do you want to assign the selected employee? (Use arrow keys)",
      type: "list",
      name: "new_role",
      choices: roleArr
    },
  ]).then((answers) => {
    db.query("UPDATE employee SET role_id=? WHERE id=?", [answers.new_role,answers.name], (err, data) => {
        console.table(data);
        mainMenu();
    })
  })
};
mainMenu();

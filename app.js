
const inquirer = require("inquirer");
const mysql = require('mysql');


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employeedb"
  });


connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
 menuPrompt()
});
function menuPrompt(){
    inquirer
        .prompt({
            type: "list",
            name: "promptChoice",
            message: "Make a selection:",
            choices: ["View All Employees", "View Roles", "View Departments", "Add Employee", "Add Roles", "Add Departments", "Update Employee Role", "Exit Program"]
          })
        .then(answer => {
            switch(answer.promptChoice){
                case "View All Employees":
                queryEmployeeList();
                break;

                case "View Roles":
                queryRolesOnly();
                break;

                case "View Departments":
                    viewAllDepartments();
                break;

                case "Add Employee":
                addEmployee();
                break;

                case "Add Roles":
                addRole();
                break;

                case "Add Departments":
                addDepartment();
                break;

                
                case "Update Employee Role":
                updateEmployeeRole();
                break;


                case "Exit Program":
         
                process.exit();                
            }             
        });
}
//-----------------------------------------------------------------------------------------------------------------------------
function queryEmployeeList () {
    var sqlStr = "SELECT first_name, last_name, title, salary FROM employee ";
    sqlStr += "LEFT JOIN role ";
    sqlStr += "ON employee.role_id = role.id"
    connection.query(sqlStr, function (err, result) {
        if (err) throw err;

        console.table(result)
        menuPrompt();
    })
}
//-----------------------------------------------------------------------------------------------------------------------------

function queryRolesOnly() {
    var sqlStr = "SELECT * FROM role";
    connection.query(sqlStr, function (err, result) {
        if (err) throw err;

        console.table(result)
        menuPrompt();
    })
}
//-----------------------------------------------------------------------------------------------------------------------------
function viewAllDepartments() {
    var sqlStr = "SELECT * FROM department";
    connection.query(sqlStr, function (err, result) {
        if (err) throw err;

        console.table(result)
        menuPrompt();
    })
}


//-----------------------------------------------------------------------------------------------------------------------------
function addEmployee(){
   
    const newEmployee = {
        firstName: "",
        lastName: "", 
        roleID: 0, 
       
    };
    
    inquirer
        .prompt([{
            name: "firstName",
            message: "Enter first name: ",
            
            },
             {
            name: "lastName",
            message: "Enter last name: ",
           
            }])
        .then(answers => {
         
            newEmployee.firstName = answers.firstName;
            newEmployee.lastName = answers.lastName;
          
            const query = `SELECT role.title, role.id FROM role;`;
            connection.query(query, (err, res) => {
                if (err) throw err;
              
                const roles = [];
                const rolesNames = [];
                for (let i = 0; i < res.length; i++) {
                    roles.push({
                        id: res[i].id,
                        title: res[i].title
                    });
                    rolesNames.push(res[i].title);
                }
              
                inquirer
                .prompt({
                    type: "list",
                    name: "rolePromptChoice",
                    message: "Select Role:",
                    choices: rolesNames
                  })
                .then(answer => {
                 
                    const chosenRole = answer.rolePromptChoice;
                    let chosenRoleID;
                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].title === chosenRole){
                            chosenRoleID = roles[i].id;
                        }
                    }
             
                    newEmployee.roleID = chosenRoleID;
                   
                          
                            const query = "INSERT INTO employee SET ?";
                            connection.query(query, {
                                first_name: newEmployee.firstName,
                                last_name: newEmployee.lastName,
                                role_id: newEmployee.roleID || 0,
                                }, (err, res) => {
                                if (err) throw err;
                                console.log("Employee Added");
                           
                                setTimeout(queryEmployeeList, 500);
                            });                            
                        });
                    });
                });
            };            
//-----------------------------------------------------------------------------------------------------------------------------
function addDepartment() {
    inquirer
      .prompt([
    
        {
          type: "input",
          name: "department",
          message: "What is the new department's name?",
        },
      ])
      .then(function (data) {
        connection.query(
          "INSERT INTO department SET ?",
          {
            Ename: data.department
          },
         function(err, res){
          if (err) throw err;
          viewAllDepartments();
         }
        )
      })
  }
//-----------------------------------------------------------------------------------------------------------------------------
function addRole() {
    console.log("-------------------------------------");
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
  
      const myDeps = res.map(function (deps) {
        return { 
          name: deps.name,
          value: deps.id 
        };
      });
  
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "What is the new role's title?"
          },
          {
            type: "input",
            name: "salary",
            message: "What is the new role's salary?"
          },
          {
            type: "list",
            name: "department",
            message: "What is the new role's department?",
            choices: myDeps
          }
        ])
        .then(function (data) {
          connection.query("INSERT INTO role SET ?",
            {
              title: data.title,
              salary: data.salary,
              department_id: data.department,
            },
            function (err, res) {
              if (err) throw err;
              queryRolesOnly()
            }
          );
        });
    });
  }
//-----------------------------------------------------------------------------------------------------------------------------

function updateEmployeeRole(){
   
    const updatedEmployee = {
        id: 0,
        roleID: 0, 
    };
   
    const query = `
    SELECT id, concat(employee.first_name, " ", employee.last_name) AS employee_full_name
    FROM employee ;`;
    connection.query(query, (err, res) => {
        if (err) throw err;

        let employees = [];
        let employeesNames = [];
        for (let i=0;i<res.length;i++){
            employees.push({
                id: res[i].id,
                fullName: res[i].employee_full_name});
            employeesNames.push(res[i].employee_full_name);
        }
        
        inquirer
        .prompt({
            type: "list",
            name: "employeePromptChoice",
            message: "Select employee to update:",
            choices: employeesNames
          })
        .then(answer => {
       
            const chosenEmployee = answer.employeePromptChoice;
            let chosenEmployeeID;
            for (let i = 0; i < employees.length; i++) {
              if (employees[i].fullName === chosenEmployee) {
                chosenEmployeeID = employees[i].id;
                break;
              }
            }
          
            updatedEmployee.id = chosenEmployeeID;
       
            const query = `SELECT role.title, role.id FROM role;`;
            connection.query(query, (err, res) => {
                if (err) throw err;
               
                const roles = [];
                const rolesNames = [];
                for (let i = 0; i < res.length; i++) {
                    roles.push({
                        id: res[i].id,
                        title: res[i].title
                    });
                    rolesNames.push(res[i].title);
                }
               
                inquirer
                .prompt({
                    type: "list",
                    name: "rolePromptChoice",
                    message: "Select Role:",
                    choices: rolesNames
                })
                .then(answer => {
              
                    const chosenRole = answer.rolePromptChoice;
                    let chosenRoleID;
                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].title === chosenRole){
                            chosenRoleID = roles[i].id;
                        }
                    }
                 
                    updatedEmployee.roleID = chosenRoleID;
                 
                    const query = `UPDATE employee SET ? WHERE ?`;
                    connection.query(query, [
                        {
                          role_id: updatedEmployee.roleID
                        },
                        {
                          id: updatedEmployee.id
                        }
                        ], (err, res) => {
                        if (err) throw err;
                        console.log("Employee Role Updated");
                       
                        setTimeout(queryEmployeeList, 500);
                    });
                });
            });            
        });
    });
}

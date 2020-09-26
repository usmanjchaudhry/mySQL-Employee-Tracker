USE employeeDB;

INSERT INTO department (id, Ename)
VALUES
(1, "Community Relations"),
(2, "Management"),
(3, "HR"),
(4, "IT");

INSERT INTO role(id, title, salary, department_id)
VALUES
(1, "CEO", 1200000, 1), 
(2, "Product Manager", 90000, 1), 
(3, "Senior Engineer", 80000, 2),
(4, "Junior Engineer", 70000, 2),
(5, "Sales Lead", 75000, 3),
(6, "Creative Director", 80000, 4),
(7, "Social Media Manager", 60000, 4),
(8, "Chief Quality Tester", 90000, 1);

INSERT INTO employee (id, first_name, last_name, role_id)
VALUES
(1, "John", "Redcord", 1), 
(2, "Joey", "Exotic", 2), 
(3, "Sada", "Baby", 3), 
(4, "Uzi", "Vert", 4), 
(5, "Red", "Yachty", 5), 
(6, "Julie", "Kay", 6),
(7, "Kevin", "Hart", 7),
(8, "Bill", "Burr", 8 );
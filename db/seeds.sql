INSERT INTO department (name)
VALUES
('Human Resources'),
('Development'),
('Administration'),
('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES
('Manager', '85000', 1),
('Manager', '105000', 2),
('Manager', '45000', 3),
('Developer', '95000', 2),
('Junior Developer', '55000', 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Amelia', 'Airheart', 1, NULL),
('Emma', 'Olson', 4, 1),
('Astro', 'Rossow', 5, 1),
('Pickle', 'Rossow', 5, 1);
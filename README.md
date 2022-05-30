# Employee Content Management System

## Purpose
The purpose of this application is to allow business owners to create and easily manage a database of their employees. It is an easy-to-use content management system designed for small and medium sized businesses. Writing this application gave me a deeper understanding on databases, their structure, and the different ways they can be used in programming. 

### User Story
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business

## Application Details

### Installation
This application has no live deployment. To use the app, clone the repository to your local machine, run an npm install, and start via your command line by cd'ing into the root directory and running npm start.

### Code Summary
This application runs via command line interface using inquirer.prompt in conjunction with sql database queries. The main application code runs in index.js - this contains the init() function and all the associated inquirer prompts. There are a few helper files that are imported into index.js (questions.js & queries.js) to help outsoruce codeblocks where necessary. 

The database schema is set up as demonstrated:
![(screenshot of database schema)](./assets/images/Screen%20Shot%202022-05-29%20at%206.38.36%20PM.png)

API routes are split into the following files: departmentRoutes, employeeRoutes, and roleRoutes. Each has api endpoints written for get all from table, get one from table based on id, delete one from table based on id, update one, and post one. While these are not currently being used in the functional application, they are helpful for understanding the structure of the database and for future development.

If you wish to experiment with these endpoints, you can start the server by running node server.js in the root directory and use your preferred application for testing (Postman, Insomnia, etc.). Server will run on port 3001. 

### Technologies Used
Backend: Javascript, Node.js

Project dependencies: Inquirer, mysql2, console.table
Installed for future development: Express.js, dotenv

### File Structure

Screenshot of file structure:
![(screenshot of file structure)](./assets/images/Screen%20Shot%202022-05-29%20at%206.40.33%20PM.png)

## Deployed Application

[Link to Google Drive Walkthrough Video](https://drive.google.com/file/d/1822aqUiwfP6PxP1CC5RtitVBJRqnS7RK/view)

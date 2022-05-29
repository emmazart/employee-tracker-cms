- write methods for returning sql queries in helper class -- store.js
- CRUD for department api routes
- CRUD for role api routes
- CRUD for employee api routes
- install inquirer & use helper class to populate inquirer prompts with sql choices


Link to Screencastify Video:
https://drive.google.com/file/d/1822aqUiwfP6PxP1CC5RtitVBJRqnS7RK/view

# Employee Content Management System

## Purpose


### User Story
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business

## Application Details
This application is deployed with Heroku. Live deployment links can be found below in the [Deployed Application section.](#deployed-application)

This application stores note data in JSON format in the db.json file. It then uses this file via the fs module to store and retrieve notes. 

### Installation
This application has no live deployment. To use the app, clone the repository to your local machine, run an npm install, and start via your command line by cd'ing into the root directory and running npm start.

### Code Summary

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

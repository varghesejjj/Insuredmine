# Insuredmine Nodejs Assessment

## Description
The project uses the provided data as given in the .csv file sent along with the assessment details and tries to achieve / complete the following tasks.

Task 1:
1) Create API to upload the attached XLSX/CSV data into MongoDB. (Please accomplish this using worker threads)
2) Search API to find policy info with the help of the username.
3) API to provide aggregated policy by each user.
4) Consider each info as a different collection in MongoDB (Agent, User, User's Account, LOB, Carrier, Policy).

Task 2:
1) Track real-time CPU utilization of the node server and on 70% usage restart the server.
2) Create a post-service that takes the message, day, and time in body parameters and it inserts that message into DB at that particular day and time.

## Installation
- The app can be run by initially running the 
>      npm i

  command after cloning the repository.

- Once the required modules are installed you can create the .env file with the PORT information.

- ***Note: The MongoDB database of the project is set up to run locally. Please make sure the local instance of MongoDB is running at port 27017.***

- To run the app you can use the already installed nodemon package
>      nodemon index.js

## Project Breakdown
- The project is broken down into the models and tasks folder.
    - The Models folder consists of all the schema that are needed in the project.
    - The Tasks folder consists of the various controller files broken down into each tasks as Task1.js aand Task2.js as well as the worker process that is used to achieve the file upload operation concurrently
  - The index.js file consists of all the API endpoints.
    - /uploadFile - Task 1.1 and 1.4
    - /search - Task 1.2
    - /policy-aggregation - Task 1.3
    - /schedule-message - Task 2.2
  - Task 2.1 is achieved in the index.js file by using a library called systeminformation and using an interval to check the CPU usage every minute

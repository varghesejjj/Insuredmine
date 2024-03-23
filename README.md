# Project Title
Insuredmine Assesment for Nodejs Development

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

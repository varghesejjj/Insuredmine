const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

// Task 2
const { exec } = require('child_process');
// Getting the system information using a npm package systeminformation
const si = require('systeminformation');

const app = express();

dotenv.config();

app.use(morgan("dev"));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Insuredmine').then(() => {
    console.log('MongoDB connected');
}).catch((error) => {
    console.error(`MongoDB connection error: ${error.message}`);
});


// Import the Tasks from respective Controllers
const Task1 = require('./Tasks/Task1');
const Task2 = require('./Tasks/Task2');

// Endpoint to upload files

// Task 1
app.post('/uploadFile', upload.single('datafile'), Task1.uploadFile);

app.get('/search', Task1.searchPolicy);

app.get('/policy-aggregation', Task1.policyAggregation);

// Task 2


// Monitor CPU usage and restart server if necessary
setInterval(async () => {
    si.currentLoad()
        .then(data => {
            const cpuUsage = data.currentLoad;
            console.log(`CPU Usage: ${cpuUsage}%`)

            if (cpuUsage > 70) {
                console.log('CPU usage is over 70%. Restarting server...');
                // Replace 'your-server-start-command' with your actual server start command
                exec('npx nodemon index.js', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error restarting server: ${error}`);
                        return;
                    }
                    console.log(`Server restarted successfully: ${stdout}`);
                });
            }
        })
        .catch(error => console.error(error));
}, 1000 * 60); // Check every minute

// Schedule a message to be added to the db at a particular time and date
app.post('/schedule-message', Task2.scheduleMessage);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


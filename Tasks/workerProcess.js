const { workerData, parentPort } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const XLSX = require('xlsx');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Insuredmine').then(() => {
    console.log('MongoDB connected');
}).catch((error) => {
    console.error(`MongoDB connection error: ${error.message}`);
});

// Import your models
const Agent = require('../Models/agent');
const Account = require('../Models/account');
const User = require('../Models/user');
const PolicyCategory = require('../Models/policyCategory');
const PolicyCarrier = require('../Models/policyCarrier');
const PolicyInfo = require('../Models/policyInfo');

const processFile = (filePath, originalname) => {
    const fileExtension = path.extname(originalname);
    let records;

    if (fileExtension === '.csv') {
        const fileContent = fs.readFileSync(filePath);
        records = parse(fileContent, { columns: true, skip_empty_lines: true });
    } else if (fileExtension === '.xlsx') {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        records = XLSX.utils.sheet_to_json(sheet);
    }

    // Process and save records to MongoDB
    records.forEach(async (record) => {
        try {
            // Create and save each model instance based on the record

            // Save the Agent name if the name is not already present in the Agent collection
            const agent = await Agent.findOneAndUpdate(
                { agentName: record['agent'] },
                { $setOnInsert: { agentName: record['agent'] } },
                { upsert: true, new: true }
            );

            const exAgent = await Agent.find({ agentName: record['agent'] });

            // Save the Account name if the name is not already present in the Account collection
            const account = await Account.findOneAndUpdate(
                { accountName: record['account_name'] },
                { $setOnInsert: { accountName: record['account_name'] } },
                { upsert: true, new: true }
            );
            const exAccount = await Account.find({ accountName: record['account_name'] });

            const user = await User.create({
                firstName: record['firstname'],
                dob: new Date(record['dob']),
                address: record['address'],
                phoneNumber: record['phone'],
                state: record['state'],
                zipCode: record['zip'],
                email: record['email'],
                gender: record['gender'],
                userType: record['userType'],
                agent: exAgent[0]._id,
                account: exAccount[0]._id
            });

            //Check if catergory and policy company already exists if not save them
            const policyCategory = await PolicyCategory.findOneAndUpdate(
                { categoryName: record['category_name'] },
                { $setOnInsert: { categoryName: record['category_name'] } },
                { upsert: true, new: true }
            );

            const policyCarrier = await PolicyCarrier.findOneAndUpdate(
                { companyName: record['company_name'] },
                { $setOnInsert: { companyName: record['company_name'] } },
                { upsert: true, new: true }
            );


            const policyInfo = await PolicyInfo.create({
                policyNumber: record['policy_number'],
                policyStartDate: new Date(record['policy_start_date']),
                policyEndDate: new Date(record['policy_end_date']),
                policyPremium: record['premium_amount'],
                policyCategory: policyCategory._id,
                company: policyCarrier._id,
                user: user._id
            });

            // Log success for each record
            console.log(`Successfully saved record for ${user.firstName}`);
        } catch (error) {
            // Handle errors
            console.error(`Error saving record: ${error.message}`);
        }
    });

    // Notify the main thread that processing is done
    parentPort.postMessage('File processing completed.');
};

processFile(workerData.path, workerData.originalname);

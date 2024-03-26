const { Worker } = require('worker_threads');
const path = require('path');

// Importing models
const User = require('../Models/user');
const Agent = require('../Models/agent');
const Account = require('../Models/account');
const PolicyCategory = require('../Models/policyCategory');
const PolicyCarrier = require('../Models/policyCarrier');
const PolicyInfo = require('../Models/policyInfo');


exports.uploadFile = (async (req, res) => {
    if (req.file) {
        const worker = new Worker(path.join(__dirname, 'workerProcess.js'), {
            workerData: {
                path: req.file.path,
                originalname: req.file.originalname
            }
        });

        worker.on('message', (message) => {
            return res.status(200).json({ success: true, message });
        });

        worker.on('error', (error) => {
            return res.status(500).json({ success: false, error: error.message });
        });

        worker.on('exit', (code) => {
            if (code !== 0)
                console.error(new Error(`Worker stopped with exit code ${code}`));
        });
    } else {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
});

exports.searchPolicy = async (req, res) => {
    try {
        const firstName = req.body.firstName;
        if (!firstName) {
            return res.status(400).json({ success: false, message: 'First name is required.' });
        }

        // Find users with the given first name (Ignore case sensitivity)
        const users = await User.find({ firstName: new RegExp(firstName, 'i') });

        // Extract user IDs
        const userIds = users.map(user => user._id);

        // Find all policy info related to the user IDs
        const policies = await PolicyInfo.find({ user: { $in: userIds } })
            .populate('policyCategory')
            .populate('company')
            .populate({ path: 'user', populate: { path: 'account agent' } });

        return res.status(200).json({ success: true, policies });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Get all the policies that are linked to a specific accountName
exports.policyAggregation = async (req, res) => {
    {
        try {
            const aggregatedPolicies = await PolicyInfo.aggregate([
                {
                    // Getting all the users from the User collection
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                {
                    $unwind: '$userInfo' // Flatten the userInfo array
                },
                {
                    $lookup: {
                        from: 'accounts', // Getting all the accounts from the Account collection
                        localField: 'userInfo.account', // The reference to Accounts in User
                        foreignField: '_id',
                        as: 'accountInfo'
                    }
                },
                {
                    $unwind: '$accountInfo' // Flatten the accountInfo array
                },
                {
                    $group: {
                        _id: '$accountInfo.accountName', // Group by accountName field in Account collection
                        policies: { $push: '$$ROOT' } // Push the entire document into the policies array
                    }
                },
                {
                    $project: {
                        _id: 0, // Exclude the _id field
                        accountName: '$_id',
                        policies: 1 // Include the aggregated policies
                    }
                }
            ]);

            res.status(200).json({ success: true, aggregatedPolicies });
        } catch (error) {
            res.status(500).send(error.message);
        }
    };
}
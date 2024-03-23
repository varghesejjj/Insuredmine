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

        // Find users with the given first name
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

// Aggregate total premium by company
exports.policyAggregation = async (req, res) => {
    try {
        // Get the policy info, group the info by company and sum the policy premium
        const policies = await PolicyInfo.aggregate([
            {
                $group: {
                    _id: '$company',
                    totalPremium: { $sum: '$policyPremium' }
                }
            },
            // Lookup the company name from the policy carriers collection (Join operation)
            {
                $lookup: {
                    from: 'policycarriers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            // Cleaning the aggregation result by removing the _id field and getting the company name
            {
                $project: {
                    _id: 0,
                    company: { $arrayElemAt: ['$company.companyName', 0] },
                    totalPremium: 1
                }
            }
        ]);

        return res.status(200).json({ success: true, policies });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
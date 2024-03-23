const mongoose = require('mongoose');

// Schema for Policy Info
const policyInfoSchema = new mongoose.Schema({
    policyNumber: { type: String, required: true },
    policyStartDate: { type: Date, required: true },
    policyEndDate: { type: Date, required: true },
    policyPremium: { type: Number, required: true },
    policyCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'PolicyCategory', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'PolicyCarrier', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
module.exports = mongoose.model('PolicyInfo', policyInfoSchema);
const mongoose = require('mongoose');

// Schema for Policy Carrier
const policyCarrierSchema = new mongoose.Schema({
    companyName: { type: String, required: true }
});
module.exports = mongoose.model('PolicyCarrier', policyCarrierSchema);
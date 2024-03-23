const mongoose = require('mongoose');

// Schema for User's Account
const accountSchema = new mongoose.Schema({
    accountName: { type: String, required: true }
});
module.exports = mongoose.model('Account', accountSchema);
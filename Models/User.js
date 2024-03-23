const mongoose = require('mongoose');

// Schema for User
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: false },
    phoneNumber: { type: String, required: true },
    state: { type: String, required: false },
    zipCode: { type: String, required: false },
    email: { type: String, required: true },
    gender: String,
    userType: { type: String, required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }

});
module.exports = mongoose.model('User', userSchema);
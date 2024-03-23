const mongoose = require('mongoose');

// Schema for Agent
const agentSchema = new mongoose.Schema({
    agentName: { type: String, required: true, unique: true }
});
module.exports = mongoose.model('Agent', agentSchema);
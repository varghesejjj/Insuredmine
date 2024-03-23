const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    content: String,
    date: Date,
});

module.exports = mongoose.model('Message', MessageSchema);

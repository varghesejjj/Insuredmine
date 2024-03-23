const mongoose = require('mongoose');

// Schema for Policy Category (LOB)
const policyCategorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true }
});

module.exports = mongoose.model('PolicyCategory', policyCategorySchema);
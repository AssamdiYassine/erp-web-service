const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
}, { timestamps: true });

const Category = mongoose.model('company_category', categorySchema);

module.exports = Category;

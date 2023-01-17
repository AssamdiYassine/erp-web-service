const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  name: { type: String, required: true },
}, { timestamps: true });

const Activity = mongoose.model('company_activity', activitySchema);

module.exports = Activity;

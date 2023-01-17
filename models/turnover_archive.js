const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const turnoverSchema = new Schema({
  year: { type: String, required: true },
  value: { type: String, required: true },
  user: {type: Schema.Types.ObjectId, ref: 'user', required: true},
}, { timestamps: true });

const TurnoverArchive = mongoose.model('turnover_archive', turnoverSchema);

module.exports = TurnoverArchive;

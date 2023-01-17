const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require('./company_category');
require('./company_activity');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  id_fiscale: {
    type: String,
    unique: true
  },
  tax_amount: {
    type: String,
  },
  address: {
    type: String,
  },
  photo: {
    type: String,
  },
  creation_date: {
    type: Date,
  },
  activity_date: {
    type: Date,
  },
  number_employees: {
    type: String,
  },
  affiliation_number: {
    type: String,
  },
  tax_number: {
    type: String,
  },
  archive: {
    type: Boolean,
  },
  category: {type: Schema.Types.ObjectId, ref: 'company_category'},
  user: {type: Schema.Types.ObjectId, ref: 'user'},
  activity: {type: Schema.Types.ObjectId, ref: 'company_activity'},
}, { timestamps: true });

companySchema.pre('save', async function(next) {
  await this.populate('activity').populate('category').execPopulate();
  next()
})

const Company = mongoose.model("company", companySchema);

module.exports = Company;

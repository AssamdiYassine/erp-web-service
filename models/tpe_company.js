const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const companySchema = new mongoose.Schema({
  name: {
    type: String
  },
  address: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  rc: {
    type: String,
  },
  cnss_number: {
    type: String,
  },
  id_fiscale: {
    type: String,
    unique: true
  },
  tax_number: {
    type: String,
  },
  company_common_id: {
    type: String
  },
  user: { type: Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true });


const Company = mongoose.model("tpe_company", companySchema);

module.exports = Company;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const financeDocSchema = new mongoose.Schema({
  url: {
    type: String
  },
  type: {
    type: String
  },
	motif: {type: String},
	comment: {type: String},
	client_comment: {type: String},
	status: {type: String},
  agent: {type: Schema.Types.ObjectId, ref: 'user'},
  archive: {
    type: Boolean,
    default: false
  },
  user: {type: Schema.Types.ObjectId, ref: 'user'},
  // company: {type: Schema.Types.ObjectId, ref: 'company'},
}, { timestamps: true });


const TpeFinanceDoc = mongoose.model("tpe_finance_doc", financeDocSchema);

module.exports = TpeFinanceDoc;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const transactionDocSchema = new mongoose.Schema({
  justification_url: {
    type: String
  },
  date: {
    type: String
  },
  ref: { type: String },
  compte_bank: { type: String },
  credit: { type: String },
  debit: { type: String },
  rapprochement: { type: String },
  agent: { type: Schema.Types.ObjectId, ref: 'user' },
  user: { type: Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true });


const TpeTransactionDoc = mongoose.model("tpe_transaction_doc", transactionDocSchema);

module.exports = TpeTransactionDoc;

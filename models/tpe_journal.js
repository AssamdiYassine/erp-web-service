const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const journalSchema = new mongoose.Schema({
  num: {
    type: String
  },
  date: {
    type: String
  },
  num_piece: { type: String },
  libelle: { type: String },
  journal: { type: String },
  debit: { type: String },
  credit: { type: String },
  tva: { type: String },
  ht: { type: String },
  ttc: { type: String },
  tier: { type: String },
  echeance: { type: String },
  devise: { type: String },
  agent: { type: Schema.Types.ObjectId, ref: 'user' },
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  // company: {type: Schema.Types.ObjectId, ref: 'company'},
}, { timestamps: true });


const TpeJournal = mongoose.model("tpe_journal", journalSchema);

module.exports = TpeJournal;

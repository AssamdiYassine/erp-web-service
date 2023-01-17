const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const depenseSchema = new Schema({
  reference: { type: String },
  type_depense: { type: String },
  date_depense: { type: String },
  etat: { type: String },
  fournisseur: { type: String },
  type_document: { type: String },
  total_ht: { type: String },
  total_ttc: { type: String },
  total_regle: { type: String },
  restant: { type: String },
}, { timestamps: true });

const Depenses = mongoose.model('depenses', depenseSchema);

module.exports = Depenses;

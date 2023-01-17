const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const bankSchema = new mongoose.Schema({
  name: {
    type: String
  },
  numero: {
    type: String
  },
	url: {type: String},
  agent: {type: Schema.Types.ObjectId, ref: 'user'}, 
  user: {type: Schema.Types.ObjectId, ref: 'user'},
  // company: {type: Schema.Types.ObjectId, ref: 'company'},
}, { timestamps: true });


const TpeBank = mongoose.model("tpe_bank", bankSchema);

module.exports = TpeBank;

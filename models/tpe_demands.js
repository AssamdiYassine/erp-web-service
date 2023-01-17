const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const demandSchema = new mongoose.Schema({
	status: {type: String },
	type: {type: String },
  user: {type: Schema.Types.ObjectId, ref: 'user'},
  agent: {type: Schema.Types.ObjectId, ref: 'user'},
  ref: {
    type: String
  },
}, { timestamps: true });


const TpeDemand = mongoose.model("tpe_demand", demandSchema);

module.exports = TpeDemand;

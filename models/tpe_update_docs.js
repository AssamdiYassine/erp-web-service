const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new mongoose.Schema({
  url: {
    type: String
  },
  type: {
    type: String
  },
	motif: {type: String},
	comment: {type: String},
	status: {type: String},
  agent: {type: Schema.Types.ObjectId, ref: 'user'},
  archive: {
    type: Boolean,
    default: false
  },
  user: {type: Schema.Types.ObjectId, ref: 'user'},
  demand: { type: Schema.Types.ObjectId, ref: 'tpe_demand' },
}, { timestamps: true });


const TpeUpdateDocument = mongoose.model("tpe_update_document", documentSchema);

module.exports = TpeUpdateDocument;

// This model is for add new/update company or update user info

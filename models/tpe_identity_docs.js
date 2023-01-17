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
}, { timestamps: true });


const TpeIdentityDocument = mongoose.model("tpe_identity_document", documentSchema);

module.exports = TpeIdentityDocument;

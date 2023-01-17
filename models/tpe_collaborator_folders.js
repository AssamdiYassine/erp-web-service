const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const folderSchema = new mongoose.Schema({
	status: {type: String},
	phone: {type: String},
	email: {type: String},
  user: {type: Schema.Types.ObjectId, ref: 'user'},
  company: {type: Schema.Types.ObjectId, ref: 'tpe_company'},
  agent: {type: Schema.Types.ObjectId, ref: 'user'},
  ref: {type: String},
}, { timestamps: true });


const TpeCollaboratorFolder = mongoose.model("tpe_collaborator_folder", folderSchema);

module.exports = TpeCollaboratorFolder;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const folderSchema = new mongoose.Schema({
	status: {type: String },
  user: {type: Schema.Types.ObjectId, ref: 'user'},
  agent: {type: Schema.Types.ObjectId, ref: 'user'},
  ref: {
    type: String
  },
}, { timestamps: true });


const TpeFolder = mongoose.model("tpe_folder", folderSchema);

module.exports = TpeFolder;

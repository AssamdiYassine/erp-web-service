const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const collaboratorInfosSchema = new mongoose.Schema({
  user_infos: {
    ref: {
      type: String
    },
    phone: {
      type: String
    },
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    gender: {
      type: String
    },
    cni: {
      type: String,
    },
    expiration_date: {
      type: Date,
    },
    email: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    birth_place: {
      type: String,
    },
    nationality: {
      type: String,
    },
    city: {
      type: String,
    },
    adresse: {
      type: String,
    },
  },
  status: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  company: { type: Schema.Types.ObjectId, ref: 'tpe_company' },
  qa: { type: Schema.Types.ObjectId, ref: 'user' },
  agent: { type: Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true });


const CollaboratorInfos = mongoose.model("tpe_collaborator_infos", collaboratorInfosSchema);

module.exports = CollaboratorInfos;
 
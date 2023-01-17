const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  matricule: {
    type: String,
  },
  signupStage: {
    type: Number,
  },
  regime: { type: String },
  role: {
    type: String,
  },
  country: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false
  },
  company: {type: Schema.Types.ObjectId, ref: 'tpe_company'},
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  user_infos: { type: Schema.Types.ObjectId, ref: 'tpe_processed_collaborator' },
  archive: {
    type: Boolean,
    default: false
  },
}, 

{ 
  timestamps: true 
}
);

const User = mongoose.model("user_collaborator", userSchema);

// Export the Model
module.exports = User;

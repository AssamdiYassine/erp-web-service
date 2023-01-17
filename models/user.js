const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: {
    type: String,
    // required: true,
    // unique: true
  },
  password: {
    type: String,
  },
  passUnhached: {
    type: String,
  },
  username: {
    type: String,
  },
  matricule: {
    type: String,
  },
  phone: {
    type: String,
    // required: true,
    // unique: true
  },
  signupStage: {
    type: Number,
  },
  company: { type: Schema.Types.ObjectId, ref: 'company' },
  regime: { type: String },
  ref: {
    type: String
  },
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
  archive: {
    type: Boolean,
    default: false
  },
}, 

{ 
  timestamps: true 
}
);


userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
}

userSchema.methods.generateAuthToken = function() {
  const token =  JWT.sign({
    iss: 'UX-DEV-TEAM',
    sub: this._id,
    iat: Math.floor(new Date().getTime() / 1000), //current date
    exp: Math.floor(new Date().setDate(new Date().getDate() + 1)/1000) //current date + 1 day ahead
  }, process.env.JWT_SECRET);
  return token;
};

const User = mongoose.model("user", userSchema);

// Export the Model
module.exports = User;

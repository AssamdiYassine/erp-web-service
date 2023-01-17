const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verifycodeSchema = new Schema({
  code: { type: String, required: true },
  type: { type: String, required: true },
  type_confirmation: { type: String, required: true },
  user: {type: Schema.Types.ObjectId, ref: 'user', required: true},
  verified: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const VerifyCode = mongoose.model('verifycode', verifycodeSchema);

module.exports = VerifyCode;

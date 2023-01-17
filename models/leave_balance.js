const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveBalanceSchema = new mongoose.Schema(
  {
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    demande_id: {
      type: String,
    },
    annee: {
      type: Number,
    },
    debit: {
      type: Number,
    },
    credit: {
      type: Number,
    },
    type: {
      type: String,
    },
    date: {
      type: String,
    },
    archive: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const LeaveBalance = mongoose.model("leave_balance", leaveBalanceSchema);

function validateLeaveBalance(LeaveBalance) {
  const schema = Joi.object({
    id_user: Joi.string().required(),
    demande_id: Joi.string(),
    annee: Joi.number(),
    debit: Joi.number(),
    credit: Joi.number(),
    type: Joi.string(),
    date: Joi.string(),
  });

  //   return Joi.validate(LeaveBalance, schema);
  return schema.validate(LeaveBalance);
}

exports.LeaveBalance = LeaveBalance;
exports.leaveBalanceSchema = leaveBalanceSchema;
exports.validateLeaveBalance = validateLeaveBalance;

const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveRequestSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, default: "", ref: "user" },
    processed_by: {
      type: String,
      default: "",
    },
    request_date: {
      type: String,
    },
    selected_date: {
      type: [String],
    },
    status: {
      type: String,
    },
    nbr_jrs: {
      type: Number,
    },
    annee_debit: {
      type: Number,
    },
    processing_date: {
      type: String,
      default: "",
    },
    holiday_type: {
      type: String,
    },
    archive: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const LeaveRequest = mongoose.model("leave_request", leaveRequestSchema);

function validateLeaveRequest(LeaveRequest) {
  const schema = Joi.object({
    user: Joi.string(),
    processed_by: Joi.string(),
    request_date: Joi.string(),
    selected_date: Joi.array().items(Joi.string()),
    status: Joi.string(),
    nbr_jrs: Joi.number(),
    annee_debit: Joi.number(),
    processing_date: Joi.string(),
    holiday_type: Joi.string(),
  });

  //   return Joi.validate(LeaveRequest, schema);
  return schema.validate(LeaveRequest);
}

exports.LeaveRequest = LeaveRequest;
exports.leaveRequestSchema = leaveRequestSchema;
exports.validateLeaveRequest = validateLeaveRequest;

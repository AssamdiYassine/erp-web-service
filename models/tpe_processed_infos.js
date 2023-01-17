const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const processedInfosSchema = new mongoose.Schema({
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
  company: {
    name: {
      type: String
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    rc: {
      type: String,
    },
    cnss_number: {
      type: String,
    },
    id_fiscale: {
      type: String,
      unique: true
    },
    tax_number: {
      type: String,
    },
    company_common_id: {
      type: String
    }
  },
  status: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  agent: { type: Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true });


const TPEProcessedInfos = mongoose.model("tpe_processed_infos", processedInfosSchema);

module.exports = TPEProcessedInfos;

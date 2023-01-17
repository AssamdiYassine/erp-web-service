const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDataSchema = new mongoose.Schema({
	photo: {
		type: String,
	},
	regime: {
		type: String,
	},
	firstname: {
		type: String,
	},
	lastname: {
		type: String,
	},
	gender: {
		type: String,
	},
	cni_number: {
		type: String,
	},
	expiration_date: {
		type: Date,
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
	stay_title: {
		type: String,
	},
	stay_title_number: {
		type: String,
	},
	stay_expiration_date: {
		type: Date,
	},
	fiscal_id: {
		type: String,
	},
	professional_tax_id: {
		type: String,
	},
	city: {
		type: String,
	},
	activity_section: {
		type: String,
	},
	activity_start_date: {
		type: Date,
	},
	id_dgi: {
		type: String,
	},
	password_dgi: {
		type: String,
	},
	deposit_receipt:{
		type:String,
	},
	payment_ref:{
		type:String,
	},
    ref: {
      type: String
    },
    turnover: {
      type: Number
    },
    year: {
      type: Number
    },
	user: {type: Schema.Types.ObjectId, ref: 'user'},
	qa: {type: Schema.Types.ObjectId, ref: 'user'},
	processed_doc: {type: Schema.Types.ObjectId, ref: 'cpu_processed_doc'}
}, { timestamps: true });

const CpuUserData = mongoose.model("cpu_user_data", UserDataSchema);

module.exports = CpuUserData;

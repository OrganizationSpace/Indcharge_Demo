const mongoose = require('mongoose')
const transaction_schema = new mongoose.Schema({
	name: { type: String },
	customer_workspace: {
		type: String,
	},
	email: {
		type: String,
		required: true,
	},
	phone_number: {
		type: String,
	},
	timestamp: {
		type: String,
	},
	plan_code: {
		type: String,
	},
	amount: {
		type: Number,
		required: true,
	},
	transaction_id: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ['captured', 'failed', 'paid'],
		required: true,
	},
	payment_method: {
		type: String,
		//enum: ['card', 'upi', 'netbanking'],
		required: true,
	},
	card: {
		last_Fourdigit: {
			type: Number,
		},
		name: {
			type: String,
		},
	},
	net_banking: {
		name: {
			type: String,
		},
		account_lastDigit: {
			type: String,
		},
	},
	upi: {
		id_lastDigit: {
			type: String,
		},
	},
	gst: {
		type: Number,
	},
})
module.exports = mongoose.model('Transaction_', transaction_schema)

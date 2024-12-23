const mongoose = require('mongoose')

const subscription_schema = new mongoose.Schema({
	customer_workspace: {
		type: String,
	},

	customer_email: {
		type: String,
	},

	plan_id: {
		type: String,
	},

	plan_code: {
		type: String,
	},

	plan_name: {
		type: String,
	},
	is_free_forever: {
		type: Boolean,
	},
	product_codes: [
		{
			type: String,
			default: 'INDOPHY',
		},
	],

	type: {
		type: String,
		enum: ['onetime', 'recurring'],
	},

	status: {
		type: String,
		enum: ['ACTIVE', 'EXPIRED', 'CANCELED'],
	},

	start_date: {
		type: String, //date
	},

	end_date: {
		type: String, //date
	},
})

module.exports = mongoose.model('Subscription_', subscription_schema)

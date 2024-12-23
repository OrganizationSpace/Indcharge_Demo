const mongoose = require('mongoose')
const promo_schema = new mongoose.Schema({
	max_uses: {
		type: Number,
		default: null,
	},

	used_count: {
		type: Number,
		default: 0,
	},

	description: {
		type: String,
		//required: true,
	},

	discount_type: {
		type: String,
		enum: ['percentage', 'fixed_amount'],
		//required: true,
	},

	discount_value: {
		type: Number,
		//required: true,
	},

	code: {
		type: String,
	},

	start_date: {
		type: Date,
		required: true,
	},

	end_date: {
		type: Date,
		required: true,
	},

	is_active: {
		type: Boolean,
		default: true,
	},
})

module.exports = mongoose.model('Promo_', promo_schema)

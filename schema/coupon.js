const mongoose = require('mongoose')
const coupon_schema = new mongoose.Schema({
	code: {
		type: String,
	},
	description: {
		type: String,
	},
	discount_type: {
		type: String,
		enum: ['percentage', 'fixed_amount'],
	},
	discount_value: {
		type: Number,
	},
	expiration_type: {
		type: Date,
		enum: ['fixed', 'dynamic'],
	},

	start_date: {
		type: Date,
	},
	end_date: {
		type: Date,
	},
	status: {
		type: String,
		enum: ['ACTIVE', 'HOLD', 'REDEEMED', 'EXPIRED'],
		default: 'ACTIVE',
	},
	beneficiary: {
		type: String,
	},
	is_claimed: {
		type: Boolean,
	},
	claimed_at: {
		type: Date,
	},
})
module.exports = mongoose.model('Coupon_', coupon_schema)

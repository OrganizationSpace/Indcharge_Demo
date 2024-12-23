const mongoose = require('mongoose')
const plans_schema = new mongoose.Schema({
	code: {
		type: String,
	},

	name: {
		type: String,
	},
	description: {
		type: String,
	},
	price: {
		type: Number, //type: String, //decimal
	},
	is_free_forever: {
		type: Boolean,
	},
	product_codes: [{ type: String }],
	duration: {
		type: Number,
	},
	discount: {
		type: String,
		enum: ['COUPON', 'PROMO', 'NONE'],
	},
	tags: [
		{
			type: String,
			enum: ['POPULAR', 'COMBO', 'MONTHLY', 'YEARLY', 'FREE_FOREVER'],
		},
	],
	specifications: [
		{
			type: String,
		},
	],
	gst: {
		type: Number,
	},
})
module.exports = mongoose.model('Plans_', plans_schema)

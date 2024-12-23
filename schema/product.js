const mongoose = require('mongoose')
const product_schema = new mongoose.Schema({
	code: {
		type: String,
	},

	image: {
		type: String,
	},
	name: {
		type: String,
	},
	description: {
		type: String,
	},
	url: {
		type: String,
	},
	screen_shots: [
		{
			type: String,
		},
	],

	features: [
		{
			type: String,
		},
	],

	version: {
		type: String,
	},
	whats_new: {
		type: String,
	},
	upcoming: {
		type: String,
	},

	// integration:[{
	// 	code:{
	// 		type:String
	// 	},
	// 	name:{
	// 		type:String
	// 	},
	// 	target_product_code:{
	// 		type:String,
	// 	},
	// 	description: {
	// 		type: String,
	// 	},
	// 	logo:{
	// 		type:String
	// 	}
	// }]
})
module.exports = mongoose.model('Product_', product_schema)

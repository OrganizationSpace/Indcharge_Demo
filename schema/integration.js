const mongoose = require('mongoose')

const integration_schema = new mongoose.Schema({
	name: {
		type: String,
	},
	resource: {
		type: String,
	},
	need: {
		type: String,
	},
	code: {
		type: String,
	},
	description: {
		type: String,
	},
})
module.exports = mongoose.model('Integration_', integration_schema)

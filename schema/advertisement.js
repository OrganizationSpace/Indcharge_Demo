const mongoose = require('mongoose')

const advertisement_schema = new mongoose.Schema({
	image: {
		type: String,
	},
	url: {
		type: String,
	},
	button_text: {
		type: String,
	},
})

module.exports = mongoose.model('Advertisement_', advertisement_schema)

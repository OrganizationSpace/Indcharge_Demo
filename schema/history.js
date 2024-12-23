const mongoose = require('mongoose')

const history_schema = new mongoose.Schema({
	workspace: { type: String },
	code: { type: String },
})

module.exports = mongoose.model('History_', history_schema)



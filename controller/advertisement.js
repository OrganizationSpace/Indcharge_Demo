const Advertisement_ = require('../schema/advertisement')
class Advertisement {
	async add({ image, url, button_text }) {
		try {
			const result = await Advertisement_({ image, url, button_text }).save()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async remove({ _id }) {
		try {
			const result = await Advertisement_.deleteOne(
				{ _id: _id },

				{ new: true }
			)

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async list() {
		try {
			const result = await Advertisement_.find()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
module.exports = Advertisement

const Plans_ = require('../schema/plans')
class Plan {
	async create({
		name,
		code,
		price,
		tags,
		description,
		product_codes,
		is_free_forever,
		discount,
		specifications,
		duration,gst
	}) {
		try {
			const result = new Plans_({
				duration,
				name,
				code,
				price,
				tags,
				is_free_forever,
				description,
				product_codes,
				discount,
				specifications,
				gst
			}).save()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async list({}) {
		try {
			const result = await Plans_.find({})
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async fetch({ code }) {
		try {
			const result = await Plans_.findOne({ code }).lean()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	//for masfob
	async fetchV2({ product_code }) {
		try {
			const result = await Plans_.find({ product_codes: product_code }).lean()

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async fetchFree({ code }) {
		try {
			const result = await Plans_.findOne({
				code: code,
				is_free_forever: true,
			}).lean()

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async update({ code, description, name, price,gst }) {
		try {
			const result = await Plans_.updateOne(
				{ code: code },
				{
					$set: { description: description, name: name, price: price,gst:gst },
				},
				{ new: true }
			)

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async updateDiscountType({ code, discount }) {
		try {
			const result = await Plans_.updateOne(
				{ code: code },
				{ $set: { discount: discount } },
				{ new: true }
			)

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async remove({ code }) {
		try {
			const result = await Plans_.deleteMany(
				{ code },

				{ new: true }
			)

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
module.exports = Plan

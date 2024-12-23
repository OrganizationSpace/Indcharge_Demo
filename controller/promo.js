const Promo_ = require('../schema/promo')
class Promo {
	async generate({
		max_uses,
		used_count,
		code,
		description,
		discount_type,
		discount_value,
		start_date,
		end_date,
	}) {
		try {
			const result = new Promo_({
				max_uses,
				used_count,
				code,
				description,
				discount_type,
				discount_value,
				start_date,
				end_date,
			}).save()
		//	console.log("result",result);
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	async list() {
		try {
			const result = await Promo_.find()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	async fetch({ code }) {
		try {
			const result = await Promo_.findOne({ code })
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async remove({ code }) {
		try {
			const result = await Promo_.deleteMany(
				{ code: { $in: code } },
				{ new: true }
			)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async redeem({ code, session }) {
		try {
			const result = await Promo_.findOneAndUpdate(
				{ code },
				{ $inc: { used_count: 1 } },
				{ new: true, session: session }
			)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
module.exports = Promo

const { v4: uuidv4 } = require('uuid')
const Coupon_ = require('../schema/coupon')
class Coupon {
	async generate({
		coupon_count,
		description,
		discount_type,
		discount_value,
		start_date,
		end_date,
		isActive,
	}) {
		try {
			const couponCodes = []
			for (let i = 0; i < coupon_count; i++) {
				const prefix = 'MindVision'
				const randomCode = uuidv4()
				const code = `${prefix}-${randomCode}`
				const result = new Coupon_({
					code,
					description,
					discount_type,
					discount_value,
					start_date,
					end_date,
					isActive,
				}).save()
				couponCodes.push(result)
			}
			return couponCodes
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async list() {
		try {
			const result = await Coupon_.find()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async fetch({ code }) {
		try {
			const result = await Coupon_.findOne({ code })
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async remove({ code }) {
		try {
			const result = await Coupon_.deleteMany(
				{  code: { $in: code } },

				{ new: true }
			)

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async removeAll() {
		try {
			const result = await Coupon_.deleteMany(
				{},

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
			const result = await Coupon_.updateOne(
				{ code },
				{ $set: { status: 'REDEEMED' } },
				{ new: true, session: session }
			)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async hold({ code }) {
		try {
			const result = await Coupon_.findOneAndUpdate(
				{ code, status: 'ACTIVE' },
				{ $set: { status: 'HOLD' } }
			)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async unhold({ code }) {
		try {
			const result = await Coupon_.findOneAndUpdate(
				{ code, status: 'HOLD' },
				{ $set: { status: 'ACTIVE' } },
				{ new: true }
			)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async update() {
		try {
			const result = await Coupon_.findOneAndUpdate(
				{},
				{ $set: { status: 'ACTIVE' } }
			)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async test({ date }) {
			try {
				const result = await Coupon_.aggregate([
					{
						$match: {
							start_date: { $gte: date },
							status: "REDEEMED",
							discount_type: "percentage", 
						},
					},
					{
						$group: {
						  _id: null, 
						  count: { $sum: 1 },
						  data: {
							$push: {
								description: "$description",
								discount_type: "$discount_type",
								discount_value: "$discount_value",
								start_date: "$start_date",
								end_date: "$end_date",
								status: "$status",
							},
						},	
						},
					  },
					  {
						$project:{
							_id: 0,
						}
					  }
				])
				console.log("result:",result);

				// const response = {
				// 	count: result.length, 
				// 	data: result 
				//   };

				return result
			} catch (error) {
				console.error(error)
				throw error
			}
		}

}
module.exports = Coupon

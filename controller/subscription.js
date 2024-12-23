const Subscription_ = require('../schema/subscription')

class Subscription {
	async create({
		customer_workspace,
		customer_email,
		plan_code,
		plan_name,
		start_date,
		end_date,
		product_codes,
		type,
		status,
		is_free_forever,
	}) {
		try {
			const result = new Subscription_({
				customer_workspace,
				customer_email,
				plan_code,
				plan_name,
				start_date,
				end_date,
				product_codes,
				type,
				status,
				is_free_forever,
			}).save()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async getActiveProducts({ customer_workspace }) {
		try {
			const result = await Subscription_.find(
				{ customer_workspace: customer_workspace, status: 'ACTIVE' },
				{ product_codes: 1, _id: 0, end_date: 1 }
			).lean()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	// async list({ customer_workspace }) {
	// 	try {
	// 		const result = await Subscription_.find({
	// 			customer_workspace: customer_workspace,
	// 			status: 'ACTIVE',
	// 		})
	// 		return result
	// 	} catch (error) {
	// 		console.error(error)
	// 		throw error
	// 	}
	// }

	async list({ customer_workspace, page, query }) {
		try {
			const limit = 7
			var criteria = { customer_workspace }
			if (query) {
				const SubscriptionNameRegex = new RegExp(query, 'i')
				criteria.Subscription_name = SubscriptionNameRegex
				// console.log("2222222222222");
				// console.log(campaignNameRegex);
				// console.log("22222222222222222222");
			}
			const result = await Subscription_.find({
				customer_workspace: customer_workspace,
				status: 'ACTIVE',
			})
				.sort({ created_at: -1 })
				.skip(page * limit)
				.limit(limit)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}


	async listV2({ page, query }) {
		try {
			const limit = 7
			//var criteria = { customer_workspace }
			if (query) {
				// const SubscriptionNameRegex = new RegExp(query, 'i')
				// criteria.Subscription_name = SubscriptionNameRegex
				// // console.log("2222222222222");
				// // console.log(campaignNameRegex);
				// // console.log("22222222222222222222");
			}
			const result = await Subscription_.find({
				//customer_workspace: customer_workspace,
				status: 'ACTIVE',
			})
				.sort({ created_at: -1 })
				.skip(page * limit)
				.limit(limit)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}



}
module.exports = Subscription

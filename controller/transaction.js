const Transaction_ = require('../schema/transaction')
class transaction {
	async create({
		customer_workspace,
		email,
		name,
		amount,
		phone_number,
		payment_method,
		status,
		plan_code,
		transaction_id,
		timestamp,
		gst,
	}) {
		try {
			const result = new Transaction_({
				customer_workspace,
				email,
				name,
				amount,
				phone_number,
				payment_method,
				status,
				plan_code,
				transaction_id,
				timestamp,
				gst,
			}).save()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	// async list({ customer_workspace }) {
	// 	try {
	// 		const result = await Transaction_.find({ customer_workspace }, { customer_workspace: 0,workspace:0, })
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
				const transactionNameRegex = new RegExp(query, 'i')
				criteria.transaction_name = transactionNameRegex
				// console.log("2222222222222");
				// console.log(campaignNameRegex);
				// console.log("22222222222222222222");
			}
			const result = await Transaction_.find(
				{ customer_workspace },
				{ customer_workspace: 0 }
			)
				.sort({ created_at: -1 })
				.skip(page * limit)
				.limit(limit)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}


	async listV2({  page, query }) {
		try {
			const limit = 7
			//var criteria = { customer_workspace }
			if (query) {
				// const transactionNameRegex = new RegExp(query, 'i')
				// criteria.transaction_name = transactionNameRegex
				// // console.log("2222222222222");
				// // console.log(campaignNameRegex);
				// // console.log("22222222222222222222");
			}
			const result = await Transaction_.find(
				
			)
				.sort({ created_at: -1 })
				.skip(page * limit)
				.limit(limit)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async getProductRevenue({ timestamps }) {
		try {
			const result = await Transaction_.aggregate([
				{
					$match: {
						timestamp: { $in: timestamps },
						status: 'paid',
					},
				},
				{
					$group: {
						_id: '$plan_code',
						revenue: { $sum: { $toInt: '$amount' } },
						count: { $sum: 1 },
					},
				},
			])
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async getTotalRevenue({ timestamps }) {
		try {
			const result = await Transaction_.aggregate([
				{
					$match: {
						timestamp: { $in: timestamps },
						status: 'paid',
					},
				},
				{
					$group: {
						_id: null,
						revenue: { $sum: { $toInt: '$amount' } },
					},
				},
			])
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async fetchRevenue({ monthNumber }) {
		try {
			const result = await Transaction_.find({
				$expr: {
					$eq: [
						{ $month: { $dateFromString: { dateString: '$timestamp' } } },
						monthNumber,
					],
				},
			}).lean()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	// async getProductRevenue({timestamp}) {
	// 	try {
	// 		const result = await Transaction_.aggregate([
	// 			{ $match: {timestamp:timestamp,
	// 				status: 'paid' } },
	// 			{
	// 				$group: {
	// 					_id: '$plan_code',
	// 					revenue: { $sum: '$amount' },
	// 					count: { $sum: 1 },
	// 				},
	// 			},
	// 		])
	// 		return result
	// 	} catch (error) {
	// 		console.error(error)
	// 		throw error
	// 	}
	// }

	// async getTotalRevenue({timestamp}) {
	// 	try {
	// 		const result = await Transaction_.aggregate([
	// 			{ $match: { timestamp:timestamp,
	// 				status: 'paid' } },
	// 			{
	// 				$group: {
	// 					_id: null,
	// 					revenue: { $sum: '$amount' },
	// 				},
	// 			},
	// 		])
	// 		return result
	// 	} catch (error) {
	// 		console.error(error)
	// 		throw error
	// 	}
	// }
}
module.exports = transaction

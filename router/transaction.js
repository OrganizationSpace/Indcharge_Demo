const express = require('express')

const { rupeesToPaisa, paisaToRupees } = require('../function/paise')
const { sign, attestation } = require('../function/signature')

const {
	getCurrentISTTime,
	calculateEndDate,
} = require('../function/current_time')
const authorization = require('../function/auth')
const Coupon = require('../controller/coupon')
const Transaction = require('../controller/transaction')
const Transaction_ = require('../schema/transaction')
const coupon = new Coupon()

const router = express.Router()
const transaction = new Transaction()

router.use(express.json())

// router.post('/create', attestation, async (req, res) => {
// 	try {
// 		const paymentFailedData = req.body.data
// 		const notes = paymentFailedData.payload.payment.entity.notes
// 		const paymentEntity = paymentFailedData.payload.payment.entity
// 		const paymentMethod = paymentFailedData.payload.payment.entity
// 		const paymentStatus = paymentFailedData.payload.payment.entity

// 		const paymentTransaction = paymentFailedData.payload.payment.entity
// 		const customerAmount = paymentFailedData.payload.payment.entity

// 		const customerNumber = paymentEntity.contact
// 		const customerEmail = notes.email
// 		const customerName = notes.plan_name
// 		//	const workspace = notes.workspace
// 		const customer_workspace = notes.customer_workspace
// 		const plan_code = notes.plan_code
// 		const method = paymentMethod.method
// 		const status = paymentStatus.status
// 		const transaction_id = paymentTransaction.id
// 		const gst = notes.gst

// 		const customerAmounts = paisaToRupees(customerAmount.amount)
// 		const statusPaid = status === 'captured' ? 'paid' : status

// 		if (status === 'failed') {
// 			await coupon.update({})
// 		}
// 		const istTime = getCurrentISTTime()
// 		await transaction.create({
// 			customer_workspace: customer_workspace,
// 			email: customerEmail,
// 			name: customerName,
// 			amount: customerAmounts,
// 			phone_number: customerNumber,
// 			payment_method: method,
// 			plan_code: plan_code,
// 			status: statusPaid,
// 			transaction_id: transaction_id,
// 			timestamp: istTime.toISOString(),
// 			gst: gst,
// 		})

// 		res.status(200).json({
// 			success: true,
// 			message: 'New payment created.',
// 		})
// 	} catch (error) {
// 		console.error('Error in /payment/create:', error)
// 		res.status(500).json({
// 			success: false,
// 			message: 'Internal Server Error',
// 			error: error.message,
// 		})
// 	}
// })

router.post('/create', attestation, async (req, res) => {
	try {
		const paymentFailedData = req.body.data
		const paymentEntity = paymentFailedData.payload.payment.entity
		const notes = paymentEntity.notes

		const customerNumber = paymentEntity.contact
		const customerEmail = notes.email
		const customerName = notes.plan_name
		const customerWorkspace = notes.customer_workspace
		const planCode = notes.plan_code
		const paymentMethod = paymentEntity.method
		const paymentStatus = paymentEntity.status
		const transactionId = paymentEntity.id
		const gst = notes.gst

		const customerAmount = paisaToRupees(paymentEntity.amount)
		const statusPaid = paymentStatus === 'captured' ? 'paid' : paymentStatus

		if (paymentStatus === 'failed') {
			await coupon.update({})
		}

		const istTime = getCurrentISTTime()
		await transaction.create({
			customer_workspace: customerWorkspace,
			email: customerEmail,
			name: customerName,
			amount: customerAmount,
			phone_number: customerNumber,
			payment_method: paymentMethod,
			plan_code: planCode,
			status: statusPaid,
			transaction_id: transactionId,
			timestamp: istTime.toISOString(),
			gst: gst,
		})

		res.status(200).json({
			success: true,
			message: 'New payment created.',
		})
	} catch (error) {
		console.error('Error in /payment/create:', error)
		res.status(500).json({
			success: false,
			message: 'Internal Server Error',
			error: error.message,
		})
	}
})

router.post('/list', authorization, async (req, res) => {
	try {
		const page = req.body.page ?? 0
		const query = req.body.query ?? null

		const list_transactions = await transaction.list({
			customer_workspace: req.workspace,
			page,
			query,
		})

		res.status(200).json({
			success: true,
			message: 'transaction list successfully',
			data: list_transactions,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/list/v2', authorization, async (req, res) => {
	try {
		const page = req.body.page ?? 0
		const query = req.body.query ?? null

		const list_transactions = await transaction.listV2({
			// customer_workspace: req.workspace,
			page,
			query,
		})

		res.status(200).json({
			success: true,
			message: 'transaction list successfully',
			data: list_transactions,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

// router.get('/revenue', async (req, res) => {
// 	try {
// 		const product_revenue = await transaction.getProductRevenue()
// 		const total_revenue = await transaction.getTotalRevenue()

// 		const revenue = {
// 			total_revenue: total_revenue[0].revenue,
// 			products: product_revenue,
// 		}

// 		res.status(200).json({
// 			success: true,
// 			message: 'revenue fetched sucessfully ',
// 			data: revenue,
// 		})
// 	} catch (error) {
// 		console.error(error)
// 		res.status(500).json({ success: false, message: error.message, error })
// 	}
// })

router.get('/revenue', async (req, res) => {
	try {
		const currentDate = new Date()

		const monthIndex = currentDate.getMonth() // Note the correction here

		const monthNumber = monthIndex + 1
		//console.log(monthNumber)
		const revenue_fetch = await transaction.fetchRevenue({ monthNumber })
		// const revenue_fetch = await Transaction_.find({
		// 	$expr: {
		// 		$eq: [
		// 			{ $month: { $dateFromString: { dateString: "$timestamp" } } },
		// 			monthNumber
		// 		]
		// 	}
		// }).lean();

		const timestamps = revenue_fetch.map((item) => item.timestamp) // Extract timestamps from each document

		const product_revenue = await transaction.getProductRevenue({ timestamps })
		const total_revenue = await transaction.getTotalRevenue({ timestamps })

		const revenue = {
			total_revenue: total_revenue.length > 0 ? total_revenue[0].revenue : 0,
			products: product_revenue,
		}
		//console.log('revenue', revenue)

		res.status(200).json({
			success: true,
			message: 'Revenue for the specified month fetched successfully',
			data: revenue,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.get('/revenue/previous', async (req, res) => {
	try {
		const currentDate = new Date(Date.now())

		const monthNumber = currentDate.getMonth()

		const revenue_fetch = await transaction.fetchRevenue({ monthNumber })

		// const revenue_fetch = await Transaction_.find({
		//     $expr: {
		//         $eq: [
		//             { $month: { $dateFromString: { dateString: "$timestamp" } } },
		//             monthIndex
		//         ]
		//     }
		// }).lean();

		const timestamps = revenue_fetch.map((item) => item.timestamp) // Extract timestamps from each document

		const product_revenue = await transaction.getProductRevenue({ timestamps })
		const total_revenue = await transaction.getTotalRevenue({ timestamps })

		const revenue = {
			total_revenue: total_revenue.length > 0 ? total_revenue[0].revenue : 0,
			products: product_revenue,
		}

		res.status(200).json({
			success: true,
			message: 'Revenue for the specified month fetched successfully',
			data: revenue,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

// const currentDate = new Date(Date.now());
// console.log(currentDate);

// // Get the month index (0 for January, 1 for February, ..., 11 for December)
// const monthIndex = currentDate.getMonth();

// console.log(monthIndex);
// // var monthIndex=4

// router.get('/revenue/before', async (req, res) => {
//     try {
//         const revenue = await Transaction_.find({
//             $expr: {
//                 $eq: [
//                     { $month: { $dateFromString: { dateString: "$timestamp" } } },
//                     monthIndex  -1
//                 ]
//             }
//         }
// 		);
//         console.log(revenue);
//         res.status(200).json({
//             success: true,
//             message: 'Revenue for the specified month fetched successfully',
//             data: revenue,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: error.message, error });
//     }
// });

module.exports = router

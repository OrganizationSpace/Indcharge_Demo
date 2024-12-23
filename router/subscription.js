const express = require('express')

const mongoose = require('mongoose')
const authorization = require('../function/auth')
const checkSubscription = require('../function/product_codes')
const {
	getCurrentISTTime,
	calculateEndDate,
} = require('../function/current_time')
const { sign, attestation } = require('../function/signature')
const { setChannel, sendToQueue, ack, nack } = require('../rabbitmq/channel')
const Subscription_ = require('../schema/subscription')
const Subscription = require('../controller/subscription')
const Coupon = require('../controller/coupon')
const Plan = require('../controller/plan')
const History = require('../controller/history')
const Promo = require('../controller/promo')

const router = express.Router()
const subscription = new Subscription()
const promo = new Promo()
const plan = new Plan()
const coupon = new Coupon()
const history = new History()
router.use(express.json())

router.post('/create', attestation, async (req, res) => {
	const session = await mongoose.startSession();
    session.startTransaction();
	try {
		const notes = req.body.data.payload.payment_link.entity.notes
		const plan_code = notes.plan_code
		const workspace = notes.workspace

		const fetch_plan = await plan.fetch({
			
			code: plan_code,
		})

		const planCode = fetch_plan.code
		const product_codes = fetch_plan.product_codes
		const plan_name = fetch_plan.name

		

		const customer_workspace = notes.customer_workspace
		const customerEmail = notes.email

		const planDuration = parseInt(fetch_plan.duration)
		

		const is_discount = notes.is_discount

		if (is_discount) {
			console.log('DISCOUNT')

			const discount_mode = notes.discount_mode
			if (discount_mode == 'COUPON') {
				//const discount_code = notes.discount_code

				await coupon.redeem({
				
					code: notes.discount_code,
					session
				})

				console.log('REDEEMED')
			} else if (discount_mode == 'PROMO') {
				await promo.redeem({
					
					code: notes.discount_code,
					session
				})

				await history.create({
				
					code: notes.discount_code,
					session
				})
			}
		}

		const istTime = getCurrentISTTime()
		const end_date = calculateEndDate(istTime, planDuration)

		const subscription_data=await subscription.create({
		
			customer_workspace: customer_workspace,
			customer_email: customerEmail,
			plan_code: planCode,
			plan_name: plan_name,
			is_free_forever: false,
			start_date: istTime.toISOString(),
			end_date: new Date(end_date).toISOString(),
			product_codes: product_codes,
			type: 'recurring',
			status: 'ACTIVE',
			session
		})

		await session.commitTransaction();
        session.endSession();
		//console.log("subscription_data",subscription_data);

	
		res.status(200).json({
			success: true,
			message:
				'Subscription created successfully, and the specified coupon is deactivated!',
		})
	} catch (error) {
		await session.abortTransaction();
        session.endSession();
		console.error('Error:', error)
		res
			.status(500)
			.json({ error: 'Internal server error. Please check your input data.' })
	}
})

router.post('/check', attestation, async (req, res) => {
	console.log('check data', req.body)
	try {
		const code = req.body.code

		const check_subscription = await subscription.getActiveProducts({
			customer_workspace: req.body.workspace,
		})
		console.log("check_subscription",check_subscription);

		const total_products = checkSubscription(check_subscription, code)

		if (total_products.isValid) {
			res
				.status(200)
				.json({ success: true, data: { limit: total_products.endDate } })
		} else {
			res.status(400).json({
				success: false,
				message:
					'you cant buy this product right now. Please contact our support team for help.',
			})
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

// router.post('/a', async (req, res) => {
// 	try {
 
// const currentDate =new Date()
// 		const subscriptions = await Subscription_.find({
// 			is_free_forever: false,
// 			status: 'ACTIVE',
// 			//end_date: { $lte: currentDate.toISOString() },
// 			end_date:{ $lte: currentDate } 
// 		});
		
// 		console.log('Total subscriptions found:', subscriptions.length);
// 		// const list_subscriptions = await Subscription_.updateMany({
// 		// 	_id:req.body.id
// 		// },{$set:{status:"EXPIRED"}},{new:true})

// 		res.status(200).json({
// 			success: true,
// 			message: 'subscriptionList',
// 			data: subscriptions,
// 		})
// 	} catch (error) {
// 		console.error(error)
// 		res.status(500).json({ success: false, message: error.message, error })
// 	}
// })

router.post('/list', authorization, async (req, res) => {
	try {
		const page = req.body.page ?? 0; 
        const query = req.body.query ?? null;

		const list_subscriptions = await subscription.list({
			//workspace: req.workspace
			customer_workspace: req.workspace,page, query 
		})

		res.status(200).json({
			success: true,
			message: 'subscriptionList',
			data: list_subscriptions,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})
router.post('/list/v2', authorization, async (req, res) => {
	try {
		const page = req.body.page ?? 0; 
        const query = req.body.query ?? null;

		const list_subscriptions = await subscription.listV2({
			//workspace: req.workspace
			// customer_workspace: req.workspace,
			page, query 
		})

		res.status(200).json({
			success: true,
			message: 'subscriptionList',
			data: list_subscriptions,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/free/get', async (req, res) => {

	try {
		const {plan_code,workspace,email}=req.body
		const fetch_plan = await plan.fetchFree({
			//workspace:workspace,
			//workspace: 'masfob',
			code: plan_code,
		})
	
		if (fetch_plan) {
			const create = await subscription.create({
			
				customer_workspace: workspace,
				customer_email: email,
				plan_code: fetch_plan.code,
				plan_name: fetch_plan.name,
				is_free_forever: fetch_plan.is_free_forever,
				start_date: '0000-00-00T00:00:00.000Z',
				end_date: '0000-00-00T00:00:00.000Z',
				product_codes: fetch_plan.product_codes,
				type: 'recurring',
				status: 'ACTIVE',
			})
		
			res.status(200).json({
				success: true,
				message: 'subscriptionList',
				data: create,
			})
		} else {
			res.status(400).json({
				success: false,
				message: 'no free forever plan found',
				data: fetch_plan,
			})
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

module.exports = router

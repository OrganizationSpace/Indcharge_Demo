const Transaction = require('../controller/transaction')
const Subscription = require('../controller/subscription')
const { setChannel, sendToQueue, ack, nack } = require('./channel')

const Plan = require('../controller/plan')
const Promo = require('../controller/promo')

const { rupeesToPaisa, paisaToRupees } = require('../function/paise')
const {
	getCurrentISTTime,
	calculateEndDate,
} = require('../function/current_time')
const Coupon = require('../controller/coupon')
const transaction = new Transaction()
const subscription = new Subscription()
const coupon = new Coupon()
const plan = new Plan()
const promo = new Promo()

async function brokerRouter(data) {
	try {
		var payload = JSON.parse(Buffer.from(data.content).toString())
		//console.log(payload.data)
		switch (payload.action) {
			case 'PREFERENCE_INIT':
				//console.log('c1', payload.data)
				ack(data)
				break
			case 'TRANSACTION_CREATE':
				try {
					const payment = payload.data
					console.log('PAYMENT', payment);
					
					const paymentEntity = payment.payload.payment.entity
					console.log('PAYMENT ENTITY', paymentEntity);
					
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
					const statusPaid =
						paymentStatus === 'captured' ? 'paid' : paymentStatus

					if (paymentStatus === 'failed') {
						console.log('FAILED')

						if (notes.is_discount) {
							console.log('DISCOUNT')
							if (notes.discount_mode == 'COUPON') {
								console.log('COUPON')
								// const couponUpdate = await Coupon_.updateOne(
								// 	{
								// 		//workspace: notes.workspace,
								// 		code: notes.discount_code,
								// 	},
								// 	{
								// 		$set: {
								// 			status: 'ACTIVE',
								// 		},
								// 	}
								// )

								await coupon.unhold({
									code: notes.discount_code,
								})
							}
						}
					}

					const istTime = getCurrentISTTime()
					const transaction_data=await transaction.create({
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
					//console.log("transaction_data",transaction_data);
   
					sendToQueue('account_center', 'SERVICE_MAIL', {
						service: 'TRANSACTION_CREATE',
						agent: transaction_data,
					})

					ack(data)
				} catch (error) {
					console.log(error)
				}
				break
			case 'SUBSCRIPTION_CREATE':
				try {
					const notes = payload.data.payload.payment_link.entity.notes
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
							})

							console.log('REDEEMED')
						} else if (discount_mode == 'PROMO') {
							const promo_redeem=await promo.redeem({
								code: notes.discount_code,
							})
							// console.log("promo",promo_redeem);
							// console.log("oooooooooooooooooooooo");
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
					})
// console.log("subscription_data",subscription_data);

					ack(data)
							
		// sendToQueue('account_center', 'SERVICE_MAIL', {
		// 	service: 'SUBSCRIPTION_CREATE',
		// 	agent: subscription_data,
		// })
				} catch (error) {
					console.log(error)
				}
		

				break
			default:
				//console.log('OTHER', payload.data)
				//channel.nack(data)
				break
		}
	} catch (error) {
		console.error('Error processing message:', error)
		ack(data)
		// Handle error if needed
	}
}
module.exports = brokerRouter

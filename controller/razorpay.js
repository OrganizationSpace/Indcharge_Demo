const axios = require('axios')
const { rupeesToPaisa } = require('../function/paise')
const {
	calculateFixedDiscount,
	calculatePercentageDiscount,
} = require('../function/discount')
const Coupon = require('../controller/coupon')
const Plan = require('../controller/plan')
const Promo = require('../controller/promo')

const coupon = new Coupon()
const plan = new Plan()
const promo = new Promo()
//cmd
// its working
class razorpay {
	async generatePaymentLink(req) {
		const code = req.body.data.plan_code
		const fetch_plan = await plan.fetch({ code: code })

		//var amount = parseInt(fetch_plan.price);

		var amount = fetch_plan.price
		const gst = fetch_plan.gst
		const currency = 'INR'
		const description = 'Subscription Payment'

		const is_discount = req.body.data.is_discount

		var discount_mode
		var discount_code
		var discount_value
		var discount_type

		if (is_discount) {
			console.log('DISCOUNT')
			discount_mode = req.body.data.discount_mode

			if (discount_mode == 'COUPON') {
				console.log('MODE : COUPON')
				discount_code = req.body.data.discount_code
				const update = await coupon.fetch({
					code: req.body.data.discount_code,
				})

				if (update.status == 'HOLD') {
					console.log('STATUS HOLD')
					discount_type = update.discount_type

					if (discount_type == 'fixed_amount') {
						console.log('DISCOUNT TYPE FIXED')
						const calculate_discount = calculateFixedDiscount(update, amount)
						amount = calculate_discount.total_amount
						//console.log(calculate_discount);
					} else if (discount_type == 'percentage') {
						console.log('DISCOUNT TYPE PERCENTAGE')
						const percentage = update.discount_value
						const calculate_discount = calculatePercentageDiscount(
							percentage,
							amount
						)
						amount = calculate_discount.total_amount
						// console.log(amount);
					} else {
						console.log('NOT DISCOUNT TYPE')
					}
				} else {
					console.log('COUPON STATUS NO ON HOLD')
				}
			} else if (discount_mode == 'PROMO') {
				console.log('MODE : PROMO')
				discount_code = req.body.data.discount_code
				const update = await promo.fetch({
					code: req.body.data.discount_code,
				})

				//   console.log(update);
				discount_type = update.discount_type

				if (discount_type == 'fixed_amount') {
					console.log('DISCOUNT TYPE FIXED')
					const calculate_discount = calculateFixedDiscount(update, amount)
					amount = calculate_discount.total_amount
					// console.log('AFTER' + amount.toString());
				} else if (discount_type == 'percentage') {
					console.log('DISCOUNT TYPE PERCENTAGE')
					const percentage = update.discount_value
					const calculate_discount = calculatePercentageDiscount(
						percentage,
						amount
					)
					amount = calculate_discount.total_amount
				} else {
					console.log('NOT DISCOUNT TYPE')
				}
			} else {
				console.log('nothing')
			}
		}

		const data = {
			customer_workspace: req.workspace,
			email: req.email,
			plan_code: fetch_plan.code,
			plan_name: fetch_plan.name,
			plan_id: fetch_plan._id,
			event: 'indcharge_subscription',
			is_discount: is_discount,
			discount_mode: discount_mode,
			discount_code: discount_code,
			discount_type: discount_type,
			discount_value: discount_value,
			gst: gst,
		}
		amount = this.calculate_gst(gst, amount)
		// console.log("00000000000000000");
		// console.log(data);
		// console.log("00000000000000000");

		const razorpay_link = await this.generateRazorPayLink({
			req,
			amount,
			currency,
			description,
			data,
		})
		// req.link = razorpay_link;

		return razorpay_link
	}
	calculate_gst(gst, amount) {
		const total_amount = (amount * (1 + gst / 100)).toFixed(2)
		return total_amount
	}
	async generateRazorPayLink({ req, amount, currency, description, data }) {
		const keyId = 'rzp_test_sg5G9dRywg3Sli'
		const keySecret = 'TiOTaNgoEqt3xYLDJunnEED1'
		const amount_in_paise = rupeesToPaisa(amount)

		try {
			const response = await axios.post(
				'https://api.razorpay.com/v1/payment_links',
				{
					amount: amount_in_paise,
					currency,
					description,
					callback_url: 'https://account.masfob.com',
					notes: data,
				},
				{
					auth: {
						username: keyId,
						password: keySecret,
					},
				}
			)

			const paymentLink = response.data.short_url
			return paymentLink
		} catch (error) {
			console.error('ERROR')
			console.error(error)
			// res.status(200).json({ success: true, message: 'success' })
		}
	}
}

module.exports = razorpay

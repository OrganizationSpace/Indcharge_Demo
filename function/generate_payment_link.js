
// // const Coupon=require('../controller/coupon')
// // const Plan=require('../controller/plan')
// // const Promo=require('../controller/promo')

// const {generateRazorPayLink} = require('../function/generate_razorpay_link')

// const { calculateFixedDiscount, calculatePercentageDiscount  }=require('./discount')
// //const {rupeesToPaisa,paisaToRupees}=require('./paise')
// const coupon= new Coupon ()
// const plan= new Plan()
// const promo= new Promo ()

// const generatePaymentLink = async (req, res, next) => {
	

//   const code = req.body.data.plan_code
// 	const fetch_plan = await plan.fetch({ workspace:req.workspace,code:code })
	
// 	var amount = parseInt(fetch_plan.price)

// 	const currency = 'INR'
// 	const description = 'Subscription Payment'

  
// 	const is_discount = req.body.data.is_discount
	
// 	var calculate_discount
// 	var discount_mode
// 	var discount_code
// 	var discount_value
// 	var discount_type
// 	if (is_discount) {
// 		console.log('DISCOUNT')
// 		discount_mode = req.body.data.discount_mode
// 		if (discount_mode == 'COUPON') {
// 			console.log('MODE : COUPON')
// 			discount_code = req.body.data.discount_code

// 			const update = await coupon.fetch({
// 				workspace:req.workspace,
// 				code: req.body.data.discount_code,
// 			})
			
// 			if (update.status == 'HOLD') {
// 				console.log('STATUS HOLD')
// 				discount_type = update.discount_type
// 				if (discount_type == 'fixed_amount') {
// 					console.log('DISCOUNT TYPE FIXED')
// 				 calculate_discount  = calculateFixedDiscount(update, amount);
// 				var amount =calculate_discount.total_amount
// 					console.log(calculate_discount);
// 				} else if (discount_type == 'percentage') {
// 					console.log('DISCOUNT TYPE PERCENTAGE')

// 					percentage = update.discount_value
// 				calculate_discount = calculatePercentageDiscount(percentage, amount);
// 			var	amount =calculate_discount.total_amount
// 			console.log(amount);
				

// 				} else {
// 					console.log('NOT DISCOUNT TYPE')
// 				}
// 			} else {
// 				console.log('COUPON STATUS NO ON HOLD')
// 			}
// 		} else if (discount_mode == 'PROMO') {
// 			console.log('MODE : PROMO')
// 			discount_code = req.body.data.discount_code

// 			const update = await promo.fetch({
// 				workspace:req.workspace,
// 				code: req.body.data.discount_code,
// 			})
// 			console.log(update)
// 			discount_type = update.discount_type
// 			if (discount_type == 'fixed_amount') {
// 				console.log('DISCOUNT TYPE FIXED')
// 				calculate_discount  = calculateFixedDiscount(update, amount);
// 			amount =calculate_discount.total_amount
// 				console.log('AFTER' + amount.toString())
// 			} else if (discount_type == 'percentage') {
// 				console.log('DISCOUNT TYPE PERCENTAGE')
// 				var percentage = update.discount_value;
// 				calculate_discount = calculatePercentageDiscount(percentage, amount);
// 			 amount =calculate_discount.total_amount
		
// 	} else {
// 				console.log('NOT DISCOUNT TYPE')
// 			}
// 		} else {
// 			console.log('nothing')
// 		}	}
// const data = {
// 		workspace:fetch_plan.workspace,
// 		customer_workspace: req.workspace,
// 		email: req.email,
// 		plan_code: fetch_plan.code,
// 	plan_name: fetch_plan.name,
// 		plan_id: fetch_plan._id,
// 		event: 'indcharge_subscription',
// 		is_discount: is_discount,
// 		discount_mode: discount_mode,
// 		discount_code: discount_code,
// 		discount_type: discount_type,
// 		discount_value: discount_value,
// 		}
		
// const razorpay_link=await generateRazorPayLink({req,amount,currency,description,data})
// 	req.link=razorpay_link
	
	
// next()
// }
// module.exports = generatePaymentLink









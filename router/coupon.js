const express = require('express')

const Coupon = require('../controller/coupon')
const Plan = require('../controller/plan')

const authorization = require('../function/auth')
const { sign, attestation } =require('../function/signature')
const {
	calculateFixedDiscount,
	calculatePercentageDiscount,
} = require('../function/discount')

const router = express.Router()
const coupon = new Coupon()
const plan = new Plan()
router.use(express.json())

router.post('/generate', authorization, async (req, res, next) => {
	try {
		const { description, discount_type, discount_value, start_date, end_date } =
			req.body

		const generate_coupon = await coupon.generate({
			
			coupon_count: parseInt(req.body.coupon_count),
			description: description,
			discount_type: discount_type, // or 'fixed_amount'
			discount_value: discount_value, // Set the discount value as needed
			start_date: start_date,
			end_date: end_date,
			//is_active: true,
		})
		//
		//console.log(generate_coupon)

		res.status(200).json({
			success: true,
			message: 'Coupon generate successfully ',
			data: generate_coupon,
		})
	} catch (error) {
		console.error(error)
		next(error)
	}
})

router.post('/list', authorization, async (req, res) => {
	try {
		const list_coupons = await coupon.list({
			
		})
		res.status(200).json({
			success: true,
			message: 'Coupons are listed successfully ',
			data: list_coupons,
		})
	} catch (error) {
		next(error)
	}
})

router.post('/remove', authorization, async (req, res) => {
	try {
		const code = req.body.code
		const removed_coupon = await coupon.remove({
		
			code: code,
		})
		res
			.status(200)
			.json({ success: true, message: 'plansDelete', data: removed_coupon })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/remove/all', authorization, async (req, res) => {
	try {
		const removed_coupons = await coupon.removeAll({
		
		})
		res
			.status(200)
			.json({ success: true, message: 'plansDelete', data: removed_coupons })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})
//

router.post('/unhold', authorization, async (req, res) => {
	try {
		//console.log(req.body.data)
		var code = req.body.data.code
//console.log(code);
		const unhold_coupon = await coupon.unhold({
		
			code: code,
		})
		res
			.status(200)
			.json({ success: true, message: 'coupon released', data: unhold_coupon })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

// router.post('/redeem', attestation, authorization, async (req, res) => {
// 	try {
	
  
// 		var plan_code = req.body.data.plan_code
// 		var discount_code = req.body.data.discount_code

// 		const fetch_plan = await plan.fetch({
			
// 			code: plan_code,
// 		})

// 		const update = await coupon.hold({
			
// 			code: discount_code,
// 		})

// 		// console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
// 		// console.log(update)
// 		// console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
// 		if (update == null) {
// 			return res.status(403).json({
// 				success: false,
// 				message: 'Coupon does not exist',
// 			})
// 		}else{

// 		// console.log('plan:', fetch_plan)
// 		// console.log(update)
// 		var discount_type = update.discount_type
// 		var amount = fetch_plan.price
// 		var calculate_discount
// 		// console.log('********************************************')
// 		// console.log(discount_type)
// 		// console.log('********************************************')
// 		// console.log(amount)
// 		if (discount_type == 'fixed_amount') {
// 			console.log('fixed amount')
// 			calculate_discount = calculateFixedDiscount(update, amount)
// 		} else if (discount_type == 'percentage') {
// 			console.log('percentage')
// 			var percentage = update.discount_value
// 			calculate_discount = calculatePercentageDiscount(percentage, amount)
// 		}
  
// 	  res.status(200).json({
// 		success: true,
// 		message: 'Coupon update successful',
// 		data: {
// 		  amount: amount.toString(),
// 		  discount_amount: discountCalculation.discount_amount.toString(),
// 		  total_amount: discountCalculation.total_amount.toString(),
// 		},
// 	  })
// 		}
// ;
  
// 	} catch (error) {
// 		console.error(error);
// 	   res.status(500).json({
// 		  success: false,
// 		  message: "Internal server error",
// 		  error: error.message,
// 		});
// 	  }
router.post('/redeem', authorization, async (req, res) => {
	try {
	  const { plan_code, discount_code } = req.body.data;
  
	  const fetch_plan = await plan.fetch({ code: plan_code });
	  const update = await coupon.hold({ code: discount_code });
  
	  if (!update) {
		return res.status(403).json({
		  success: false,
		  message: 'Coupon already used',
		});
	  }
  
	  const discount_type = update.discount_type;
	  const amount = fetch_plan.price;
	  let calculate_discount;
  
	  if (discount_type === 'fixed_amount') {
		console.log('fixed amount');
		calculate_discount = calculateFixedDiscount(update, amount);
	  } else if (discount_type === 'percentage') {
		console.log('percentage');
		const percentage = update.discount_value;
		calculate_discount = calculatePercentageDiscount(percentage, amount);
	  }
  
	  return res.status(200).json({
		success: true,
		message: 'Coupon applied successfully',
		data: {
		  amount: amount.toString(),
		  discount_amount: calculate_discount.discount_amount.toString(),
		  total_amount: calculate_discount.total_amount.toString(),
		},
	  });
  
	} catch (error) {
	  console.error(error);
	  return res.status(500).json({
		success: false,
		message: "Internal server error",
		error: error.message,
	  });
	}

  });
  
module.exports = router

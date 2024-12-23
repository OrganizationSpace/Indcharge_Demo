const express = require('express')

const authorization = require('../function/auth')
const Plan = require('../controller/plan')

const router = express.Router()
const plan = new Plan()
router.use(express.json())

router.post('/create', authorization, async (req, res) => {

	try {
		const {
			name,
			code,
			price,
			description,
			product_codes,
			is_free_forever,
			specifications,
			duration,
			tags,
			discount,
			gst
		} = req.body

		const new_play = await plan.create({
		
			price: price,
			name: name,
			code: code,
			tags: tags,
			discount: discount,
			is_free_forever: is_free_forever,
			description: description,
			product_codes: product_codes,
			specifications: specifications,
			duration: duration,
			gst:gst
		})

		res.status(200).json({
			success: true,
			message: 'plans created successful',
			data: new_play,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/list', authorization, async (req, res) => {
	
	try {
		const list_plans = await plan.list({})
		res
			.status(200)
			.json({ success: true, message: 'planList', data: list_plans })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/update', authorization, async (req, res) => {
	
	try {
		const update_plan = await plan.update({
		
			code: req.body.code,
			name: req.body.name,
			price: req.body.price,
			description: req.body.description,
			gst:req.body.gst
		})

		res.status(200).json({
			success: true,
			message: 'plans update successful',
			data: update_plan,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/discount/update', authorization, async (req, res) => {

	try {
		const updatePlan = await plan.updateDiscountType({
		
			code: req.body.code,
			discount: req.body.discount,
		})

		res.status(200).json({
			success: true,
			message: 'Plans update successful',
			data: updatePlan,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message })
	}
})

router.post('/remove', authorization, async (req, res) => {
	try {
		const remove_plan = await plan.remove({
		
			code: req.body.code,
		})
		res
			.status(200)
			.json({ success: true, message: 'plansDelete', data: remove_plan })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

module.exports = router

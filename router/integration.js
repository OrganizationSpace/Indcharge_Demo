const express = require('express')
const Integration_ = require('../schema/integration')
const authorization = require('../function/auth')
const Integration = require('../controller/integration')
const Subscription = require('../controller/subscription')
const { sign, attestation } = require('../function/signature')
const integration = new Integration()
const subscription = new Subscription()
const router = express.Router()
router.use(express.json())

router.post('/add', authorization, async (req, res) => {
	try {
	
		const { name, resource, need, code, description } = req.body
		const integration_add = await integration.add({
		
			name,
			resource,
			need,
			code,
			description,
		})
		res.status(200).json({
			success: true,
			message: 'integration added successful',
			data: integration_add,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/list', authorization, async (req, res) => {
	try {
		
		const integration_list = await integration.list()
		res.status(200).json({
			success: true,
			message: 'integration list successful',
			data: integration_list,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/list/:need', authorization, async (req, res) => {
	// console.log(
	// 	'___________________________________________________________________'
	// )
	// console.log(req.body)
	// console.log(
	// 	'___________________________________________________________________'
	// )

	try {
		
		const need = req.params.need
		const need_list = await integration.listNeed({
		
			need: need,
		})
		res.status(200).json({
			success: true,
			message: 'integration need  list successful',
			data: need_list,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/remove', authorization, async (req, res) => {
	try {
	
		const code = req.body.code
		const integration_remove = await integration.remove({
		
			code: code,
		})
		res.status(200).json({
			success: true,
			message: 'integration remove successful',
			data: integration_remove,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})
router.post('/eligible', authorization, async (req, res) => {
	try {
		
		const integration_list = await integration.fetch({
		
			code: req.body.code,
		})
		console.log("integration_list:", integration_list);
		
		const check_subscription = await subscription.getActiveProducts({
			customer_workspace: req.workspace,
		})
		console.log("check_subscription:",check_subscription);
		
		const check = await integration.checkEligible({
			integration: integration_list,
			product_codes: check_subscription,
		})
		console.log("check:",check);
	

		res.status(200).json({
			success: true,
			message: 'integration activation successfully',
			data: check,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

module.exports = router

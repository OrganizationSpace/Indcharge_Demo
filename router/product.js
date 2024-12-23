const express = require('express')
const bodyParser = require('body-parser')

const authorization = require('../function/auth')
const uploadfile = require('../function/upload_file')
const { sign, attestation } = require('../function/signature')

const Product = require('../controller/product')
const Plan = require('../controller/plan')
const Integration = require('../controller/integration')

const product = new Product()
const plan = new Plan()
const integration = new Integration()

const router = express.Router()
router.use(express.json())
router.use(bodyParser.json())

router.post('/add', authorization, uploadfile, async (req, res) => {
	try {
		// console.log(req.workspace);
		// console.log(req.body);

		const { name, code, description, url } = req.body

		const new_product = await product.add({
			code: code,
			name: name,
			description: description,
			url: url,
			image: process.env.SPACE_DOMAIN + req.file.originalname ?? 'undefined',
		})

		res.status(200).json({
			success: true,
			message: 'product add successful',
			data: new_product,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/logo/update', authorization, uploadfile, async (req, res) => {
	try {
		const logo_update = await product.updateLogo({
			code: req.body.product_code,
			//image: req.body.image,
			 image: process.env.SPACE_DOMAIN + req.file.originalname ?? "undefined",
		})

		res.status(200).json({
			success: true,
			message: 'logo update successful',
			data: logo_update,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/list', authorization, async (req, res) => {
	try {
		const list_products = await product.listV2()

		res
			.status(200)
			.json({ success: true, message: 'productList', data: list_products })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/list/v2', authorization, async (req, res) => {
	try {
		const list_products = await product.listV2()

		res
			.status(200)
			.json({ success: true, message: 'productList', data: list_products })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/fetch', authorization, async (req, res) => {
	try {
		const fetch_products = await product.fetch({
			product_code: req.body.product_code,
		})

		res
			.status(200)
			.json({
				success: true,
				message: 'products fetch successful',
				data: fetch_products[0],
			})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

//for masfob
router.post('/fetch/v2', authorization, async (req, res) => {
	try {
		const product_code = req.body.data.product_code // Corrected to access product_code

		//console.log('product_code', req.body.data.product_code)

		const fetch_product = await product.fetchv2({ product_code })
	//	console.log('fetchproduct', fetch_product)
		const fetch_plan = await plan.fetchV2({ product_code })
	//	console.log('fetchPlan', fetch_plan)

		const fetch_integration = await integration.fetchV2({ product_code })
	//	console.log('fetchIntegration', fetch_integration)

		fetch_product.plans = fetch_plan
		fetch_product.integrations = fetch_integration
		//console.log('final', fetch_product)
		res.status(200).json({
			success: true,
			message: 'Products fetch successful',
			data: fetch_product,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: error.message,
			error,
		})
	}
})

router.post('/update', authorization, async (req, res) => {
	try {
		const updated_product = await product.update({
			code: req.body.product_code,
			description: req.body.description,
			name: req.body.name,
			url: req.body.url,
		})
		res.status(200).json({
			success: true,
			message: 'update successful',
			data: updated_product,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/remove', authorization, async (req, res) => {
	try {
		const removed_product = await product.remove({
			code: req.body.code,
		})

		res
			.status(200)
			.json({ success: true, message: 'productDelete', data: removed_product })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/integration/add', authorization, async (req, res) => {
	try {
		const { product_code, name, description, logo, target_product_code } =
			req.body
		const priceUpdate = await product.addIntegration({
			product_code,
			name,
			logo,
			description,
			target_product_code,
		})

		// const priceUpdate = await Product_.updateOne(

		// {
		//     workspace: req.workspace,
		//     code: req.body.product_code,
		//   },

		// {
		//     $push: {
		//       integration: {
		//         code: "indicvbnmg",
		//         name: req.body.name,
		//         description: req.body.description,
		//         logo: req.body.logo,
		//         target_product_code: req.body.target_product_code,
		//       },
		//     },
		//   },
		//   { new: true }
		// );

		res.status(200).json({
			success: true,
			message: 'plans update successful',
			data: priceUpdate,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

///screenshot Add
router.post('/screenshot/add', authorization, uploadfile, async (req, res) => {
	const url =
		process.env.SPACE_DOMAIN + req.file.originalname ??
		'https://mindvision.sgp1.digitaloceanspaces.com/assets/user/default_user_image.png'

	try {
		const product_code = req.body.product_code // Extract product_code correctly from the request body

		const add_Screenshot = await product.addScreenshot({ product_code, url })

		res.status(200).json({
			success: true,
			message: 'Screenshot added successfully',
			data: add_Screenshot,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

///screenshot remove
router.post('/screenshot/remove', authorization, async (req, res) => {
	try {
		const { product_code, url } = req.body

		const remove_Screenshot = await product.removeScreenshot({
			product_code,
			url,
		})

		res.status(200).json({
			success: true,
			message: 'Screenshot removed successfully',
			data: remove_Screenshot,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

///features Add
router.post('/feature/add', authorization, async (req, res) => {
	//console.log(req.body)
	try {
		const { product_code, features } = req.body
		const add_feature = await product.addFeature({ product_code, features })

		res.status(200).json({
			success: true,
			message: 'Feature add successful',
			data: add_feature,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

///features remove
router.post('/feature/remove', authorization, async (req, res) => {
	try {
		const { product_code, features } = req.body

		const remove_feature = await product.removeFeature({
			product_code,
			features,
		})

		res.status(200).json({
			success: true,
			message: 'Feature removed successfully',
			data: remove_feature,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

/// version update
router.post('/version/update', authorization, async (req, res) => {
	try {
		const { product_code, version, whats_new, upcoming } = req.body
		const update_version = await product.updateVersion({
			product_code,
			version,
			whats_new,
			upcoming,
		})

		res.status(200).json({
			success: true,
			message: ' version updated successful',
			data: update_version,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

///screenshot remove
router.post('/screenshot/remove', authorization, async (req, res) => {
	try {
		const { product_code, url } = req.body

		const remove_Screenshot = await product.removeScreenshot({
			product_code,
			url,
		})

		res.status(200).json({
			success: true,
			message: 'Screenshot removed successfully',
			data: remove_Screenshot,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post(
	'/integration/list',
	//attestation,
	authorization,
	async (req, res) => {
		try {
			const priceUpdate = await product.listIntegration({ list })

			res.status(200).json({
				success: true,
				message: 'plans update successful',
				data: priceUpdate[0].integration,
			})
		} catch (error) {
			console.error(error)
			res.status(500).json({ success: false, message: error.message, error })
		}
	}
)

module.exports = router

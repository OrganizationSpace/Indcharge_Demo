const express = require('express')
const axios = require('axios')
const authorization = require('../function/auth')
const Razorpay = require('../controller/razorpay')
const Transaction = require('../controller/transaction')
const Coupon_ = require('../schema/coupon')
const Data_ = require('../schema/data')
const { sign, attestation, razorAttestation } = require('../function/signature')
const { sendToQueue } = require('../rabbitmq/channel')
const razorpay = new Razorpay()
const transaction = new Transaction()
const router = express.Router()

router.use(express.json())

router.post('/', 
	//razorAttestation, 
	async (req, res) => {
	const response = await Data_({
		data: req.body,
	})
	try {
		const savedSubscription = await response.save()

		if (req.body.event === 'payment.failed') {
			// console.log('FAILED')
			// const notes = req.body.payload.payment.entity.notes

			// if (notes.is_discount) {
			// 	console.log('DISCOUNT')
			// 	if (notes.discount_mode == 'COUPON') {
			// 		console.log('COUPON')
			// 		const couponUpdate = await Coupon_.updateOne(
			// 			{
			// 				//workspace: notes.workspace,
			// 				code: notes.discount_code,
			// 			},
			// 			{
			// 				$set: {
			// 					status: 'ACTIVE',
			// 				},
			// 			}
			// 		)
			// 		console.log('REVERTED')
			// 	}
			// }
			sendToQueue('indcharge', 'TRANSACTION_CREATE', req.body)
			// const inputdata = {
			// 	data: req.body,
			// }
			// const payload = JSON.stringify(inputdata)
			// var signature = sign(payload)
			// //var signature = sign()
			// await axios.post(
			// 	'https://indcharge.api.mindvisiontechnologies.com/transaction/create',
			// 	{
			// 		data: req.body,
			// 	},
			// 	{
			// 		headers: {
			// 			//"Authorization": token,
			// 			'x-webhook-signature': signature,
			// 		},
			// 	}
			// )
		}

		if (req.body.event === 'payment_link.paid') {
			const eventNotes = req.body.payload.payment_link.entity.notes.event

			switch (eventNotes) {
				case 'indcharge_subscription':
					// console.log('Subscription event')
					// const inputdata = {
					// 	data: req.body,
					// }
					// const payload = JSON.stringify(inputdata)
					// var signature = sign(payload)
					// //var signature = sign()
					// await axios.post(
					// 	'https://indcharge.api.mindvisiontechnologies.com/subscription/create',
					// 	{
					// 		data: req.body,
					// 	},
					// 	{
					// 		headers: {
					// 			//"Authorization": token,
					// 			'x-webhook-signature': signature,
					// 		},
					// 	}
					// )
					sendToQueue('indcharge', 'SUBSCRIPTION_CREATE', req.body)
					console.log("subscription",req.body);
					
					// var signature = sign(payload)
					// await axios.post(
					// 	'https://indcharge.api.mindvisiontechnologies.com/transaction/create',
					// 	{
					// 		data: req.body,
					// 	},
					// 	{
					// 		headers: {
					// 			//"Authorization": token,
					// 			'x-webhook-signature': signature,
					// 		},
					// 	}
					// )
					sendToQueue('indcharge', 'TRANSACTION_CREATE', req.body)
					console.log("transaction",req.body);

					break

				default:
					console.log('Unknown event')
					break
			}
		}

		res.status(200).json(response)
	} catch (error) {
		console.error('ERROR')
		console.error(error)
		res.status(200).json({ success: true, message: 'success' })
	}
})

//its working
router.post(
	'/generatepaymentlink',
	//attestation,
	authorization,
	async (req, res) => {
		try {
			// await razorpay.generatePaymentLink(req, res, () => {
			//     const link = req.link;
			//     res.status(200).json({
			//         success: true,
			//         message: "Successfully generated payment link",
			//         data: link,
			//     });
			// });

			const link = await razorpay.generatePaymentLink(req)
			console.log("link",link);
			
			res.status(200).json({
				success: true,
				message: 'Successfully generated payment link',
				data: link,
			})
		} catch (error) {
			console.error(error)
			res.status(500).json({
				success: false,
				message: 'An error occurred',
				error: error.message,
			})
		}
	}
)

// router.post(
//   "/generatepaymentlink",
//   authorization,

//   async (req, res) => {
//     try {
//       const link =await razorpay.generatePaymentLink({link:req.link,workspace:req.workspace})

//       // const link = req.link;
//       // var workspace = req.workspaces;
//       // console.log("OOOOOOOOOOOOOOOOOOO");
//       // console.log(link);
//       // console.log("OOOOOOOOOOOOOOOOOOO");
//       // console.log(workspace);
//       res.status(200).json({
//         success: true,
//         message: "Successfully generated payment link",
//         data: link,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         success: false,
//         message: "An error occurred",
//         error: error.message,
//       });
//     }
//   }
// );

module.exports = router

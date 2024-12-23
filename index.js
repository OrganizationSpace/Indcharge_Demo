//update

const express = require('express')
const mongoose = require('mongoose')

const morgan = require('morgan')
const Masfob = require('./masfob')
const Coupon = require('./schema/coupon')
const errorHandler = require('./function/error_handler')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const bodyParser = require('body-parser')
const jsonwebtoken = require('jsonwebtoken')
const couponCode = require('coupon-code')
const dotenv = require('dotenv')
const masfob = new Masfob()

//schema

// const Preference_ = require('./schema/preference')
// const Plans_ = require('./schema/plans')

//const Data_ = require('./schema/data')

//function
// const slacklog = require('./function/slack')
// const authorization = require('./function/auth')
// const generatePaymentLink = require('./function/generate_payment_link')
// const generateLink = require('./function/generateLink')
// const uploadfile = require('./function/upload_file')
const cors = require('./function/cors')

dotenv.config()

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(cors)
app.use(bodyParser.json())
// app.use(slacklog)
app.use(express.urlencoded({ extended: true }))

const coupon = require('./router/coupon')
const customer = require('./router/customer')

const plan = require('./router/plan')
const preference = require('./router/preference')
const product = require('./router/product')
const promo = require('./router/promo')
const subscription = require('./router/subscription')
const transaction = require('./router/transaction')
const integration = require('./router/integration')
const agent = require('./router/agent')
const advertisement = require('./router/advertisement')
const razorpay = require('./router/razorpay')
const connectRabbitMQ = require('./rabbitmq/rabbitmq')
const { setChannel, sendToQueue, ack, nack } = require('./rabbitmq/channel')

//router middleware
app.use('/coupon', coupon)
app.use('/razorpay', razorpay)
app.use('/advertisement', advertisement)
app.use('/agent', agent)
app.use('/preference', preference)
app.use('/plan', plan)
app.use('/product', product)
app.use('/customer', customer)
app.use('/promo', promo)
app.use('/subscription', subscription)
app.use('/transaction', transaction)
app.use('/integration', integration)

connectRabbitMQ()
	.then((ch) => {
		setChannel(ch)
	})
	.catch((error) => {
		console.error('Error connecting to RabbitMQ', error)
	})

app.listen(4000, () => {
	console.log('S E R V E R STARTED 💐 ')

	//connecting mongodb
	mongoose
		.connect(process.env.MYDB_CONNECTION, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			conn = mongoose.connection
			console.log('Connected to MongoDB')
		})
		.catch((error) => {
			console.log('Error connecting to MongoDB:', error)
		})
})
app.get('/', (req, res) => {
	res.json('INDCHARGE _ SERVER')
	console.log('indcharge_server')
})
app.post('/', async (req, res) => {
	try {
		const success = sendToQueue('indcharge', 'PREFERENCE_INIT', {
			name: 'github',
		})
		if (success) {
			res.status(200).send(`Message sent to queue: `)
		} else {
			res.status(500).send('Failed to send message to queue')
		}
	} catch (error) {
		console.error('Failed to send message to queue', error)
		res.status(500).send('Failed to send message to queue')
	}
})

// //Organization REGISTRATION
// app.post("/organization/registration", async (req, res) => {
//   console.log(req.body);
//   try {
//     const { organization_name, workspace } = req.body;

//     const existingOrganization = await Preference_.findOne({
//       organization_name,
//     });

//     if (existingOrganization) {
//       return res.status(400).json({ message: "Organization already exists" });
//     }

//     const organization = new Preference_({
//       organization_name: organization_name,
//       workspace: workspace,
//     });

//     const savedOrganization = await organization.save();

//     res.status(200).json({
//       organization: savedOrganization,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

// app.post("/organization/login", async (req, res, next) => {
//   console.log(req.body);
//   try {
//     const { workspace, email, password } = req.body;

//     const response = await masfob.login({
//       workspace: workspace,
//       email: email,
//       password: password,

//     });

//     if (response.status == 200) {
//       const token = response.headers["token"];
//       //const data = await prefToken(eco_token);

//       res.setHeader("token", token);

//       res.status(response.status).json({
//         success: response.data.success,
//         message: response.data.message,
//         data: response.data.data,
//       });
//     } else {
//       // Failed login
//       res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

// app.post("/agent/add", authorization, async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const agentAdd = await Organization.updateOne(
//       { workspace: req.workspace },

//       { $push: { agents: { email, password } } }
//     );
//     res.status(200).json({
//       success: true,
//       message: "agent added successful",
//       data: agentAdd,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message, error });
//   }
// });

// app.post("/agent/update", authorization, async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const agentUpdate = await Organization.updateOne(
//       { workspace: req.workspace, "agents.email": email },

//       { $set: { "agents.$.password": password } }
//     );
//     res.status(200).json({
//       success: true,
//       message: "agent updated successful",
//       data: agentUpdate,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message, error });
//   }
// });

// app.post("/agent/remove", authorization, async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const agentRemove = await Organization.updateOne(
//       { workspace: req.workspace },

//       { $pull: { agents: { email, password } } }
//     );
//     res.status(200).json({
//       success: true,
//       message: "agent successful remove",
//       data: agentRemove,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message, error });
//   }
// });

// app.post("/agent/list", authorization, async (req, res) => {
//   try {
//     const agentList = await Organization.find({ workspace: req.workspace });
//     res.status(200).json({
//       success: true,
//       message: "agent List successful ",
//       data: agentList[0].agents,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message, error });
//   }
// });

//customer add

// app.post("/integration/plan/list", async (req, res) => {
//   try {
//     const planList = await Plans_.find(
//       { workspace: "novagrid" },
//       { workspace: 0 }
//     );
//     res
//       .status(200)
//       .json({ success: true, message: "planList", data: planList });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message, error });
//   }
// });

// app.post(
//   "/generatepaymentLink",
//   authorization,
//   generatePaymentLink,
//   async (req, res) => {
//     try {
//       const link = req.link;
//       var workspace = req.workspaces;
//       console.log("OOOOOOOOOOOOOOOOOOO");
//       console.log(link);
//       console.log("OOOOOOOOOOOOOOOOOOO");
//       console.log(workspace);
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

// app.post(
//   "/check",

//   async (req, res) => {
//     try {
//       console.log(req);
//       res.status(200).json({
//         success: true,
//         message: "Successfully generated payment link",
//         data: req,
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

// app.post("/generateLink", async (req, res) => {
//   try {
//     const link = await generateLink();
//     res.status(200).json({
//       success: true,
//       message: "Successfully generated payment link",
//       data: link,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error generating payment link",
//       error: error.message,
//     });
//   }
// });
// function paisaToRupees(paisa) {
//   const rupees = paisa / 100;

//   return rupees;
// }

// app.post("/razorpay", async (req, res) => {
//   const response = await Data_({
//     data: req.body,
//   });
//   console.log("-------------------");
//   console.log(response);
//   console.log("_____________________");
//   try {
//     const savedSubscription = await response.save();

//     if (req.body.event === "payment.failed") {
//       console.log("FAILED");
//       const notes = req.body.payload.payment.entity.notes;

//       if (notes.is_discount) {
//         console.log("DISCOUNT");
//         if (notes.discount_mode == "COUPON") {
//           console.log("COUPON");
//           const couponUpdate = await Coupon.updateOne(
//             {
//               workspace: "masfob",
//               code: notes.discount_code,
//             },
//             {
//               $set: {
//                 status: "ACTIVE",
//               },
//             }
//           );
//           console.log("REVERTED");
//         }
//       }

//       const paymentFailedData = {
//         contact: req.body.payload.payment.entity.contact,
//         notes: req.body.payload.payment.entity.notes,
//         method: req.body.payload.payment.entity.method,
//         status: req.body.payload.payment.entity.status,
//         transaction_id: req.body.payload.payment.entity.id,
//       };
//       console.log("##############################");
//       console.log(paymentFailedData);
//       await axios.post(
//         "https://indcharge.api.mindvisiontechnologies.com/transaction/create",
//         {
//           data: req.body,
//         }
//       );
//     }

//     if (req.body.event === "payment_link.paid") {
//       const eventNotes = req.body.payload.payment_link.entity.notes.event;

//       switch (eventNotes) {
//         case "indcharge_subscription":
//           console.log("Subscription event");

//           await axios.post(
//             "https://indcharge.api.mindvisiontechnologies.com/subscription/create",
//             {
//               data: req.body,
//             }
//           );

//           await axios.post(
//             "https://indcharge.api.mindvisiontechnologies.com/transaction/create",
//             {
//               data: req.body,
//             }
//           );

//           break;

//         default:
//           console.log("Unknown event");
//           break;
//       }
//     }

//     res.status(200).json(response);
//   } catch (error) {
//     console.error("ERROR");
//     console.error(error);
//     res.status(200).json({ success: true, message: "success" });
//   }
// });

// // const axios = require("axios");
// // const { rupeesToPaisa } = require("../function/paise");

// async function generateRazorPayLink({
//   req,
//   amount,
//   currency,
//   description,
//   data,
// }) {
//   const keyId = "rzp_test_sg5G9dRywg3Sli";
//   const keySecret = "TiOTaNgoEqt3xYLDJunnEED1";
// const amount_in_paise = rupeesToPaisa(amount);

//   try {
//     const response = await axios.post(
//       "https://api.razorpay.com/v1/payment_links",
//       {
//         amount: amount_in_paise,
//         currency,
//         description,
//         callback_url: "https://account.mindvisiontechnologies.com",
//         notes: data,
//       },
//       {
//         auth: {
//           username: keyId,
//           password: keySecret,
//         },
//       }
//     );
   
//     const paymentLink = response.data.short_url;
//     return paymentLink;
//     // next()
//   } catch (error) {
//     console.error("ERROR");
//     console.error(error);
    
//     res.status(200).json({ success: true, message: "success" });
//   }
// }
// module.exports = { generateRazorPayLink };











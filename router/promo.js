const express = require("express");

const authorization = require("../function/auth");
// const generatePaymentLink = require('./function/generatePaymentLink')
const {
  calculateFixedDiscount,
  calculatePercentageDiscount,
} = require("../function/discount");

const History = require("../controller/history");
const { sign, attestation } =require('../function/signature')

const Promo = require("../controller/promo");

const Plan = require("../controller/plan");

const router = express.Router();
const history = new History();
const promo = new Promo();
const plan = new Plan();
router.use(express.json());

router.post("/generate", authorization, async (req, res) => {
  
  //console.log(req.body);
  try {
    const {
      description,
      max_uses,
      code,
      end_date,
      start_date,
      used_count,
      discount_type,
      discount_value,
    } = req.body;

    const new_promo = await promo.generate({
   
      max_uses: max_uses,
      used_count: used_count,
      code: code,
      description: description,
      discount_type: discount_type,
      discount_value: discount_value,
      start_date: start_date,
      end_date: end_date,
    });

   // console.log("promo generate",new_promo);
    res.status(200).json({
      success: true,
      message: "plan created successful",
      data: new_promo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message, error });
  }
});

router.post("/list", authorization, async (req, res) => {
  try {
    const list_promos = await promo.list({  });
    res
      .status(200)
      .json({ success: true, message: "List promo code", data: list_promos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message, error });
  }
});

router.post("/remove", authorization, async (req, res) => {
  try {
    const code = req.body.code;
    const removed_promo = await promo.remove({
     
      code: code,
    });

    res
      .status(200)
      .json({ success: true, message: "promo Delete", data: removed_promo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message, error });
  }
});

// router.post("/redeem",attestation,authorization, async (req, res) => {
//   var plan_code = req.body.data.plan_code;
//   var customer = req.body.data.email;
//   var discount_code = req.body.data.discount_code;

//   if (true) {
//     const promocheck = await promo.fetch({
    
//       code: discount_code,
//     });
//     var max_count = promocheck.max_uses;
//     var used_count = promocheck.used_count;
// console.log("max_count",max_count);
//     if (used_count < max_count) {
//       console.log("HISTORY CHECK");
//       const update = await promo.fetch({
     
//         code: discount_code,
//       });

//       if (update) {
//         console.log("PROMO UPDATE");

//         var discount_type = update.discount_type;

//         console.log("MAX CHECK PASS");
//         const fetch_plan = await plan.fetch({
       
//           code: plan_code,
//         });
//         //console.log(fetch_plan);
//         var amount = fetch_plan.price;
//         var calculate_discount;

//         if (discount_type == "fixed_amount") {
//           console.log("fixed amount");
//           calculate_discount = calculateFixedDiscount(update, amount);
//         } else if (discount_type == "percentage") {
//           console.log("percentage");
//           var percentage = update.discount_value;
//           calculate_discount = calculatePercentageDiscount(percentage, amount);
//         }

        
//         // await history.create({
//         //   workspace: customer,
//         //   code: discount_code,
//         // });

//         res.status(200).json({
//           success: true,
//           message: "promo update",

//           data: {
//             amount: amount.toString(),
//             discount_amount: calculate_discount.discount_amount.toString(),
//             total_amount: calculate_discount.total_amount.toString(),
//           },
//         });
//       }
//     } else {
//       console.log("MAX USED");
//       res.status(400).json({
//         success: false,
//         message: "max uses reached",
//         data: {
//           message: "max used",
//         },
//       });
//     }
//   } else {
//     res.status(500).json({
//       success: true,
//       //message: "promo update",
//       data: {
//         message: "aleady redeemed",
//       },
//     });
//   }
// });

router.post("/redeem", authorization, async (req, res) => {
  try {
    const { plan_code, email: customer, discount_code } = req.body.data;

    const promocheck = await promo.fetch({ code: discount_code });

    if (!promocheck) {
      return res.status(400).json({
        success: false,
        message: "Promo code not found",
      });
    }

    const { max_uses, used_count } = promocheck;
    //console.log("max_count", max_uses);

    if (used_count < max_uses) {
      console.log("HISTORY CHECK");

      const update = await promo.fetch({ code: discount_code });

      if (update) {
        console.log("PROMO UPDATE");

        const discount_type = update.discount_type;
        console.log("MAX CHECK PASS");

        const fetch_plan = await plan.fetch({ code: plan_code });
        const amount = fetch_plan.price;
        let calculate_discount;

        if (discount_type === "fixed_amount") {
          console.log("fixed amount");
          calculate_discount = calculateFixedDiscount(update, amount);
        } else if (discount_type === "percentage") {
          console.log("percentage");
          const percentage = update.discount_value;
          calculate_discount = calculatePercentageDiscount(percentage, amount);
        }

        // await history.create({
        //   workspace: customer,
        //   code: discount_code,
        // });

         res.status(200).json({
          success: true,
          message: "Promo code applied successfully",
          data: {
            amount: amount.toString(),
            discount_amount: calculate_discount.discount_amount.toString(),
            total_amount: calculate_discount.total_amount.toString(),
          },
        });
      } else {
         res.status(400).json({
          success: false,
          message: "Promo update failed, promo code not found",
        });
      }
    } else {
      console.log("MAX USED");
       res.status(400).json({
        success: false,
        message: "Promo code has reached its maximum uses",
      });
    }
  } catch (error) {
    console.error(error);
   res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;


module.exports = router;





const express = require("express");
const { sign, attestation } =require('../function/signature')

const authorization = require("../function/auth");
const generatePaymentLink = require("../function/generate_payment_link");


//const Agent = require("../controller/agent");

const router = express.Router();
//const agent = new Agent();
router.use(express.json());

router.post(
    "/",attestation,
    authorization,
    generatePaymentLink,
    async (req, res) => {
      try {
        const link = req.link;
      
   
        res.status(200).json({
          success: true,
          message: "Successfully generated payment link",
          data: link,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: "An error occurred",
          error: error.message,
        });
      }
    }
  );

  module.exports = router;
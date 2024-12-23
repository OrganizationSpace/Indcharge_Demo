const axios = require('axios');
const generateLink = async function(){
    try {
        const response = await axios.post(
          'https://api.razorpay.com/v1/payment_links',
          {
            amount: '1000',
            currency: 'INR',
            description: 'nothing',
          },
          {
            auth: {
              username: process.env.KEY_ID,
              password:process.env.KEY_SECRET
            },
          }
        );
    
        const paymentLink = response.data.short_url;
       // console.log(response.data);
        return paymentLink;
      } catch (error) {
        console.error('Error generating payment link:', error);
        throw error;
      }
    };
    
    module.exports = generateLink;
    
























   
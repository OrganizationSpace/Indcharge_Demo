const mongoose = require('mongoose');


const customer_schema = new mongoose.Schema({
  workspace:{
    type:String
  },
  name: {
    type: String,
    required: true,
  },
  
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },

});

module.exports = mongoose.model('Customer_', customer_schema);

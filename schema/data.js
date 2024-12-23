const mongoose = require('mongoose');


const data_schema = new mongoose.Schema({
  
 data:
 {type:Object}
  
});

module.exports = mongoose.model('Data_', data_schema);

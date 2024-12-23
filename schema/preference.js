const mongoose = require("mongoose");

const preference_schema = mongoose.Schema({
  workspace: {
    type: String,
    required: true,
    unique: true,
  },
  organization_name: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Preference_", preference_schema);
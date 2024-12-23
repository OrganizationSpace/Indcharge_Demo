const mongoose = require("mongoose");
const organization_schema = mongoose.Schema({
  workspace: {
    type: String,
    required: true,
    unique: true,
  },
  organization_name: {
    type: String,
    required: true,
  },
  agents: [ {
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
      },
      is_admin: {
        type: Boolean,
        default: false,
      },
    }, ],
});
module.exports = mongoose.model("Organization_", organization_schema);
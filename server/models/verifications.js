const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verificationSchema = new Schema({
  _id: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Verification", verificationSchema);

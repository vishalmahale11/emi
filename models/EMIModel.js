const mongoose = require("mongoose");

const emiSchema = mongoose.Schema({
  EMI: { type: Number, required: true },
  loanAmount: { type: Number, required: true },
  interest: { type: Number, required: true },
  tenure: { type: Number, required: true },
});

const EMIModel = mongoose.model("emi", emiSchema);

module.exports = { EMIModel };

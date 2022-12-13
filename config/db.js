const mongoose = require("mongoose");
require("dotenv").config();

const connection = () => {
  console.log("Connect to MongoDB");
  mongoose.set("strictQuery", true);
  return mongoose.connect(process.env.MONGODB_URL);
};

module.exports = connection;

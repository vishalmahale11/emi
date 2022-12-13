const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/db");
const UserModel = require("../models/UserModel");
const { authentication } = require("../middlewares/authentication");
const { EMIModel } = require("../models/EMIModel");

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8040;

app.get("/", (req, res) => {
  res.send("Connection success");
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const isUser = await UserModel.findOne({ email });
  if (isUser) {
    res.send({ msg: "User Already exists, try another email ID" });
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        res.send({ msg: "Something Went Wrong, Please try after sometime" });
      }
      const new_User = new UserModel({
        name,
        email,
        password: hash,
      });
      try {
        await new_User.save();
        res.send({ msg: "SignUp successful" });
      } catch (error) {
        res.send({ msg: "Something Went wrong please try after sometime" });
      }
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const hashed_password = user.password;
  const user_id = user._id;
  bcrypt.compare(password, hashed_password, function (err, result) {
    if (err) {
      res.send({ msg: "Something went wrong, Please try after sometime" });
    }
    if (result) {
      const token = jwt.sign({ user_id }, process.env.SECRET_KEY);
      res.send({ msg: "Login Successfull", token });
    } else {
      res.send({ msg: "Login Failed" });
    }
  });
});

app.get("/getProfile", authentication, async (req, res) => {
  const { user_id } = req.body;
  const user = await UserModel.findOne({ _id: user_id });
  const { name, email } = user;
  res.send({ name, email });
});

app.post("/calculateEMI", authentication, async (req, res) => {
  const { loanAmount, interest, tenure } = req.body;
  let r1 = interest / 12;
  let r = r1 / 100;
  let EMI = (loanAmount * r * (1 + r) * tenure) / ((1 + r) * tenure - 1);
  const new_EMI = new EMIModel({
    EMI,
  });
  res.send({ new_EMI });
});

app.listen(PORT, async () => {
  try {
    await connection();
    console.log(`http://localhost:${PORT}`);
  } catch (error) {
    console.log(error);
  }
});

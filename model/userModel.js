const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: false,
    },
    role :{
      type : String ,
      default : "user",
    }
  },
  { timestamps: true }
);

const userModel = new mongoose.model("user", userSchema);

module.exports = userModel;

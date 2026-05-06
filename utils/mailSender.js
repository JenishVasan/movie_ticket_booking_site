const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hjenis451@gmail.com",
    pass: process.env.APP_PASS, // The 16-character App Password
  },
});

module.exports = transporter
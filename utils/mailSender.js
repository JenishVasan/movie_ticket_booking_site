const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hjenis451@gmail.com",
    pass: "uzhskhytyixteaqp", // The 16-character App Password
  },
});

module.exports = transporter
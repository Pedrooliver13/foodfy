const nodemailer = require('nodemailer');

module.exports = transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d4bb0d369f22ee",
    pass: "86393a30cfddbc"
  }
});
const nodemailer = require("nodemailer");

async function sendResetEmail(to, resetLink) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Airbnb Clone Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  });
}

module.exports = sendResetEmail;


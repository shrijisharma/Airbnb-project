// const nodemailer = require("nodemailer");

// module.exports = async function sendResetEmail(to, resetLink) {
//   let transporter = nodemailer.createTransport({
//     service: "gmail", // ya any SMTP
//     auth: {
//       user: "YOUR_EMAIL@gmail.com",
//       pass: "YOUR_EMAIL_PASSWORD" // App password if 2FA enabled
//     }
//   });

//   await transporter.sendMail({
//     from: '"Yaatra Support" <YOUR_EMAIL@gmail.com>',
//     to,
//     subject: "Password Reset",
//     html: `<p>Click the link below to reset your password:</p>
//            <a href="${resetLink}">${resetLink}</a>`
//   });
// };
const nodemailer = require("nodemailer");

module.exports = async function sendResetEmail(to, resetLink) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Yaatra Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset",
    html: `<p>Click the link to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });
};

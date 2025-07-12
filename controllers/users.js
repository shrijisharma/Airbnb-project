const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require("../models/user.js");
const sendResetEmail = require("../utils/sendEmail.js");


// 1️⃣ Render forgot password form
module.exports.renderForgotForm = (req, res) => {
  res.render("users/forgot.ejs");
};

// 2️⃣ Handle forgot password POST
module.exports.forgotPassword = async (req, res) => {
  const token = crypto.randomBytes(20).toString('hex');
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("error", "No account with that email.");
    return res.redirect("/forgot");
  }
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: 'Password Reset',
    text: `Click the link to reset your password:\n\n
http://${req.headers.host}/reset/${token}`
  };

  await transporter.sendMail(mailOptions);
  req.flash("success", "An email has been sent with reset instructions.");
  res.redirect("/login");
};

// 3️⃣ Render reset form
module.exports.renderResetForm = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash("error", "Password reset token is invalid or expired.");
    return res.redirect("/forgot");
  }
  res.render("users/reset.ejs", { token: req.params.token });
};

// 4️⃣ Handle reset POST
module.exports.resetPassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash("error", "Password reset token is invalid or expired.");
    return res.redirect("/forgot");
  }
  await user.setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  req.flash("success", "Your password has been changed.");
  res.redirect("/login");
};

const crypto = require('crypto');
const User = require("../models/user.js");
const sendResetEmail = require("../utils/sendEmail.js");

// SIGNUP FORM
module.exports.signupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// SIGNUP HANDLER
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Airbnb Clone!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// LOGIN FORM
module.exports.loginForm = (req, res) => {
  res.render("users/login.ejs");
};

// LOGIN HANDLER
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// LOGOUT
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
};

// FORGOT PASSWORD FORM
module.exports.renderForgotForm = (req, res) => {
  res.render("users/forgot.ejs");
};

// FORGOT PASSWORD HANDLER
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

  const resetLink = `http://${req.headers.host}/reset/${token}`;
  await sendResetEmail(user.email, resetLink);

  req.flash("success", "An email has been sent with reset instructions.");
  res.redirect("/login");
};

// RESET FORM
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

// RESET HANDLER
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

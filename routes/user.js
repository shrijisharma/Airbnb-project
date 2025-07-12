const express=require("express");
// const { use } = require("passport");
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { route } = require("./listing");
const router = express.Router();
const passport=require("passport");
const {isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");

router.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.signup));

//login route
router.route("/login")
   .get(userController.loginForm)
   .post(saveRedirectUrl,
     passport.authenticate('local', { failureRedirect: '/login',failureFlash:'Invalid username or password. Please try again.' }),
     userController.login);
//logout route
router.get("/logout",userController.logout);
router.get("/forgot", userController.renderForgotForm);
router.post("/forgot", wrapAsync(userController.forgotPassword));
router.get("/reset/:token", wrapAsync(userController.renderResetForm));
router.post("/reset/:token", wrapAsync(userController.resetPassword));

module.exports=router;
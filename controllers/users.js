const User=require("../models/user.js");

module.exports.signupForm=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup=async(req,res)=>{
 try{
    let {username,email,password}=req.body;
   const newUser=new User({username,email});
   const registerUser=await User.register(newUser,password);
   console.log(registerUser);
   req.login(registerUser,(err)=>{
    if(err){
        next(err);
    }
   req.flash("success","welcome to Yaatra");
   res.redirect("/listings");
   });
  
 }catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
 }
   
};
module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login=async(req,res)=>{
req.flash("success","Welcome back to Yaatra");
let redirectUrl=res.locals.redirectUrl || "listings";
res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
};
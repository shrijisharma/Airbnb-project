// const mongoose=require("mongoose");
// const Schema=mongoose.Schema;
// const passportLocalMongoose=require("passport-local-mongoose");

// const userSchema=new Schema({
//     email:{
//         type:String,
//         required:true
//     }
// });
// userSchema.plugin(passportLocalMongoose);
// module.exports = mongoose.model('User',userSchema);

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const JWTToken = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter The Name"],
    maxLength: [30, "Name cannot be exceed 30 Characters"],
    minLength: [4, "Name should have more then 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter The Email"],
    unique: true,
    //validator is used for verify the email that it is valid or not ///
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter the password"],
    minLength: [8, "password should be greater then 8 characters"],
    //select false is used because of i can't remember right now//
    select: false,
  },
  avtar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role:{
    type:String,
    default:"user"
  },
  resetPasswordToken:String,
  resetPasswordExpire:Date,

});


//bcrypt is use for making our password in hash value so that anybody not can see the password including admin also ..... 
userSchema.pre("save", async function (next){
//we give this condition beacuse if  the password is not chaanged so it will not rehash the value so that we use next() and if the password is changed the password will be decrypt//
    if(!this.isModified("password")){
        next();
    }
//.hash is used for dcrypt the paswword 
    this.password = await bcrypt.hash(this.password, 10)
})

//jwt tokens it is used for confirm to the server that he is the corrrect user it generate the token which we will save in the cookieparsor//


userSchema.methods.getJWTToken = function(){
    return JWTToken.sign({id: this._id},process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })
}

//compare method for password //

userSchema.methods.comparePassword = async function(password){

    return bcrypt.compare(password, this.password)
}
module.exports = mongoose.model("user", userSchema)

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const JWTToken = require("jsonwebtoken");
const crypto = require("crypto")

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
  // avtar: {
  //   public_id: {
  //     type: String,
  //     required: true,
  //   },
  //   url: {
  //     type: String,
  //     required: true,
  //   },
  // },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//bcrypt is use for making our password in hash value so that anybody not can see the password including admin also .....
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

//jwt tokens it is used for confirm to the server that he is the corrrect user it generate the token which we will save in the cookieparsor//

userSchema.methods.getJWTToken = function () {
  // jwt token basically taking a payload and secret key the secret key is taken from dotenv file //
  return JWTToken.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

//compare method for password //

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

//generte password

//in this method we are using crypto for generating random password //
userSchema.methods.getResetPasswordToken = function () {
  // Generate a reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  //in this method we are using randomBytes for genertaing random password of 20digit and using hex to coonvert the buffer value to the hex digit//
  
  // Hash the token and set it to resetPasswordToken field
  this.resetPasswordToken = crypto
  //sha256 is the algorithm for security purppose // update for reset the tooken and digeest the hex value//
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    //here we do for the reset password that how long it wil supported so it will support for only 15 minutes///

  // Set token expiration
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

  return resetToken;
};
module.exports = mongoose.model("user", userSchema);

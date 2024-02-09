const User = require("../modals/UserMoals");
const Errorhandler = require("../utils/errorhandler");
const catchAsync = require("../middleware/catcheasync");
const sendToken = require("../utils/jwttoke");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto")


exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    // avatar: {
      //   public_id: "this is a sample id",
      //   url: "public url",
      // },
    });

    sendToken(user, 201, res);
  });
  exports.loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return next(new Errorhandler("Please enter the email and password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user || !user.comparePassword(password)) {
      return next(new Errorhandler("Invalid email or password", 401));
    }
  
    sendToken(user, 200, res);
  });
  
  
  exports.logoutUser = catchAsync(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      
      res.status(200).json({
        success: true,
        message: "Logged out",
      });
    } catch (error) {
      console.error("Logout Error:", error);
      next(error);
    }
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new Errorhandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();
  user.resetPasswordExpire = Date.now() + 21 * 60 * 1000; // 21 minutes expiration

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new Errorhandler(error.message, 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new Errorhandler("Reset Password Token Has been expired", 404));
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new Errorhandler("Password Does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return next(new Errorhandler("Internal Server Error", 500));
  }
});

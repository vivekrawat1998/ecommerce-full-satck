const Errorhandler = require("../utils/errorhandler");
const User = require("../modals/UserMoals");
const catcheasync = require("../middleware/catcheasync");
const sendToken = require("../utils/jwttoke");

exports.registerUser = catcheasync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avtar: {
      public_id: "this is a sample id",
      url: "public url",
    },
  });

  sendToken(user, 201, res);
});

exports.loginuser = catcheasync(async (req, res, next) => {
  const { email, password } = req.body;

  // 400 bad request
  if (!email || !password) {
    return next(new Errorhandler("please enter the email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    // 401 is used for unauthorized user
    return next(new Errorhandler("invalid user and password", 401));
  }

  const isPasswordMatches = user.comparePassword(password);

  // 401 is used for unauthorized user
  if (!isPasswordMatches) {
    return next(new Errorhandler("invalid email and password", 401));
  }

  sendToken(user, 200, res);
});

// exports.getAllUser = catcheasync(async (req, res, next) => {
//     const  user = await user

//     res.status(200).json({
//         success:true,
//         user
//     })
// })

const jwt = require('jsonwebtoken');
const user = require('../modals/UserMoals');
const catchAsync = require('./catcheasync'); // Correct the filename if needed
const ErrorHandler = require('../utils/errorhandler');

exports.isAuthenticationUser = catchAsync(async (req, res, next) => {
    console.log("Cookies:", req.cookies);
    const { token } = req.cookies;
    console.log("Token:", token);

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DecodedToken:", decodedData)
        req.user = await user.findById(decodedData.id);
        console.log("Decoded User:", req.user); // Add this line
    
        if (!req.user) {
            throw new Error("User not found");
        }
    
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        return next(new ErrorHandler("Invalid token, please login again", 401));
    }
    
});

exports.authorizedRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(
                `Role: ${req.user.role} is not allowed to access this resource`, 403
            ));
        }
        next(); 
    };
};

const Errorhandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
    console.log('Error handler middleware:', err);

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Mongoose CastError - MongoDB ID error //
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid MongoDB ID: ${err.path}`;
        const mongoIdError = new Errorhandler(message, 400);
        return next(mongoIdError);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

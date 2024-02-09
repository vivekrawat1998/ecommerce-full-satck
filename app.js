const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

// Your routes
const productRoutes = require("./routes/ProductsRoutes");
const userRoutes = require("../Backend/routes/userroutes");
const orderRoutes = require("../Backend/routes/orderRoute");

// Use the router instances for each route
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);

// Error handler middleware
app.use(errorMiddleware);

module.exports = app;

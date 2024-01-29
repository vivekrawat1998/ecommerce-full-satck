const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");

app.use(express.json());

// Your routes
const product = require("./routes/ProductsRoutes");
app.use("/api/v1", product);

// Error handler middleware
app.use(errorMiddleware);

module.exports = app;

const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");

app.use(express.json());

// Your routes
const product = require("./routes/ProductsRoutes");
const user = require("../Backend/routes/userroutes")
app.use("/api/v1", product);
app.use("/api/v1", user);

// Error handler middleware
app.use(errorMiddleware);

module.exports = app;

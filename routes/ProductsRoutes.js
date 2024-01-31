const express = require("express");
const { getAllProducts, createProduct, updateProducts, deleteProducts, getProductsDetails } = require("../controllers/Productscontroller")

const Router = express.Router();

Router.route("/products/new").post(createProduct);
Router.route("/products").get(getAllProducts);
Router.route("/products/:id").put(updateProducts);
Router.route("/products/:id").delete(deleteProducts).get(getProductsDetails) 

module.exports = Router;

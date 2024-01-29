const Product =require("../modals/Productsmodal");
const Errorhandler = require("../utils/errorhandler");
const Apifetures = require("../utils/apifeatures");
const catcheasync = require("../middleware/catcheasync");

//create Products
exports.createProduct = catcheasync( async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        // Check if the error is a Mongoose validation error
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({
                success: false,
                error: 'Validation error',
                messages: validationErrors
            });
        } else {
            // Handle other types of errors
            res.status(500).json({
                success: false,
                error: 'Server error'
            });
        }
    }
});


exports.getAllProducts = catcheasync(
    async (req, res, next) => {
        try {
         const  apifetures = new Apifetures(Product.find(),req.query)
            const products = await Product.find();
    
    
            console.log(products); // Log products to console
            res.status(200).json({
                success: true,
                products
            });
        } catch (error) {
            console.error(error); // Log errors to console
            res.status(500).json({
                success: false,
                error: "Server error"
            });
        }
    }
)

exports.updateProducts = catcheasync(
    async (req, res, next) => {
        try {
            let  products = await Product.findById(req.params.id);
            if(!products){
                return next(Errorhandler("product not found" ,  404))
               }
            products =await Product.findByIdAndUpdate(req.params.id, req.body,{
                new:true,
                runValidators: true,
                useFindAndModify: false
            })
            res.status(200).json({
                success:true,
                products
            })
        } catch (error) {
            res.status(500).json({
                success:false,
                error:"error"
            })
        }
    }
)

//delete

// ProductsController.js
// ProductsController.js

exports.deleteProducts = catcheasync(
    async (req, res, next) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
    
            if (!product) {
                return next(Errorhandler("Product not found", 404));
            }
    
            res.status(200).json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                error: 'Server error',
                details: error.message
            });
        }
    }
)




//products details //

exports.getProductsDetails = catcheasync(
    async (req, res, next) => {
        try {
            const product = await Product.findById(req.params.id);
    
            if (!product) {
             return next(Errorhandler("product not found",404))
            }
    
            console.log('Product found:', product);
    
            res.status(200).json({
                success: true,
                product
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                success: false,
                error: 'Server error',
                details: error.message
            });
        }
    }
)
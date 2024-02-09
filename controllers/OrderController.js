const Order = require("../modals/ordermodel");
const product = require("../modals/Productsmodal");
const Errorhandler = require("../utils/errorhandler");
const catchAsync = require("../middleware/catcheasync");
const catcheasync = require("../middleware/catcheasync");

exports.newOrder = catchAsync(async (req, res, next) => {
  const {
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderItems,
    shippingInfo,
    paymentInfo,
  } = req.body;

  // if (!shippingInfo || !shippingInfo.user || !shippingInfo.pinCode) {
  //   return next(
  //     new Errorhandler(
  //       "Invalid shipping information. Please provide user and pinCode.",
  //       400
  //     )
  //   );
  // }

  // if (!paymentInfo || !paymentInfo.id || !paymentInfo.status) {
  //   return next(
  //     new Errorhandler(
  //       "Invalid payment information. Please provide id and status.",
  //       400
  //     )
  //   );
  // }

  // // Validate the presence of order items
  // if (!orderItems || orderItems.length === 0) {
  //   return next(
  //     new Errorhandler(
  //       "Invalid order items. Please provide at least one item.",
  //       400
  //     )
  //   );
  // }

  // Rest of your order creation logic

  // Example: Creating a new order
  const newOrder = await Order.create({
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    shippingInfo,
    orderItems,
    paymentInfo,
    paidAt:Date.now(),
    user:req.user.id
    // Add other oder fields here
  });
 console.log(user)
  res.status(201).json({
    success: true,
    newOrder
  });
});


//get single orders//

exports.getSingleOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new Errorhandler(" Order not found with this id ", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//logged in user orders
exports.myOrder = catchAsync(async (req, res, next) => {
  // Retrieve user ID from the decoded token
  try {
    // Find orders for the logged-in user
    const orders = await Order.find({user: req.user.id})
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error in myOrder:", error);
    next(error);
  }
});

// get all orders -- Admin //

exports.getAllOrders = catchAsync(async(req,res,next)=>{
  const orders = await Order.find();
  let total =0;

  orders.forEach((order) =>{
    total+= order.totalPrice
  })

  res.status(200).json({
    success: true,
    total,
    orders
  })
})

// update order status -- Admin //

exports.updateOrders  = catchAsync(async (req,res,next)=>{
  const orders = await Order.findById(req.params.id);

  if(orders.orderStatus == "Delivered"){
    return next(new Errorhandler("you have already delivered this order", 400))
  }


  orders.orderItems.forEach(async (order) =>{
    await updateStock(order.product, order.quantity)
  })

  if(req.body.status == "Delivered"){
    orders.deliverdAt = Date.now()
  }

  await orders.save({validateBeforeSave : false})
  res.status(200).json({
    success: true
  })
})


async function updateStock (id, quantity){
  const product = await product.findById(id)
  product.Stock -= quantity
  await product.save({validateBeforeSave: false})
}


//delete order //
exports.deleteOrder = catchAsync(async (req, res, next) =>{
  const order =await Order.findById(req.params.id)

  if (!order) {
    return next(new Errorhandler(" Order not found with this id ", 404));
  }
  await order.deleteOne();
  res.status(200).json({
    success:true
  })
})
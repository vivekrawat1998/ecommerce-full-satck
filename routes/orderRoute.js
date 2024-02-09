const express = require("express");
const router = express.Router();

const { isAuthenticationUser, authorizedRole } = require("../middleware/auth");

const {
  newOrder,
  getSingleOrder,
  myOrder,
  getAllOrders,
  deleteOrder,
  updateOrders
} = require("../controllers/OrderController");

router.route("/order/new").post(isAuthenticationUser, newOrder);


router
  .route("/order/:id")
  .get(isAuthenticationUser, authorizedRole("admin"), getSingleOrder);
router.route("/orders/me").get(isAuthenticationUser, myOrder);

router
  .route("/admin/orders")
  .get(isAuthenticationUser, authorizedRole("admin"), getAllOrders);
  
router
  .route("/admin/orders/:id")
  .put(isAuthenticationUser, authorizedRole("admin"), updateOrders)
  .delete(isAuthenticationUser, authorizedRole("admin"), deleteOrder);

module.exports = router;

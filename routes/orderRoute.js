const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

// Place new order
router.post("/register", orderController.post_order);

// Fetch all orders
router.get("/", orderController.fetch_orders);

// Fetch order by id
router.get("/:id", orderController.fetch_order);

// Fetch orders by shopId
router.get("/shopId/:shopId", orderController.fetch_orders_based_shopId);

// Fetch unhandled orders by shopId
router.get(
  "/unhandled/shopId/:shopId",
  orderController.fetch_unhandled_orders_based_shopId
);

// Fetch orders by consumerId
router.get(
  "/consumerId/:consumerId",
  orderController.fetch_orders_based_consumerId
);

// Fetch orders by deliveryAgentId
router.get(
  "/deliveryAgentId/:deliveryAgentId",
  orderController.fetch_orders_based_deliveryAgentId
);

// Fetch orders where shop district and consumer district are not same based on Employee district
router.get(
  "/differentDistrict/:district",
  orderController.fetch_orders_with_different_districts
);

// Fetch orders where shop district and consumer district are same based on Employee district
router.get(
  "/sameDistrict/:district",
  orderController.fetch_orders_with_same_districts
);

//Update shop To Warehouse delivery agent by ID
router.patch(
  "/shopToWarehouse/:id",
  orderController.update_shopToWarehouse_deliveryAgent
);

//Update Warehouse to shop delivery agent by ID
router.patch(
  "/warehouseToShop/:id",
  orderController.update_warehouseToShop_deliveryAgent
);

//Update orderStatus to delivered successfully
router.patch(
  "/orderStatus/deliveredSuccessfully/:id",
  orderController.update_orderStatus_deliveredSuccessfully
);

//Update orderStatus to delivered successfully
router.patch(
  "/orderStatus/orderCollectedToWarehosue/:id",
  orderController.update_orderStatus_orderCollectedToWarehosue
);

// Fetch placed orders by based on district - not handled orders by employee
router.get("/placed/:district", orderController.fetch_placed_orders);

module.exports = router;

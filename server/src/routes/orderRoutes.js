const express = require("express");
const {
  addOrder,
  getOrders,
  getOrderById,
  deliverOrder,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const { validateCreateOrderInput } = require("../validations/orderValidation");

const router = express.Router();

router
  .route("/")
  .post(protect, validateRequest(validateCreateOrderInput), addOrder)
  .get(protect, admin, getOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/deliver", protect, admin, deliverOrder);

module.exports = router;

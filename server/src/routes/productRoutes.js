const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, optionalProtect, admin } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  validateCreateProductInput,
  validateUpdateProductInput,
} = require("../validations/productValidation");

const router = express.Router();

router
  .route("/")
  .get(optionalProtect, getProducts)
  .post(protect, admin, validateRequest(validateCreateProductInput), createProduct);
router
  .route("/:id")
  .get(optionalProtect, getProductById)
  .put(protect, admin, validateRequest(validateUpdateProductInput), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;

const express = require("express");
const {
  loginUser,
  registerUser,
  getUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  validateLoginInput,
  validateRegisterInput,
} = require("../validations/authValidation");

const router = express.Router();

router.post("/login", validateRequest(validateLoginInput), loginUser);
router.post("/", validateRequest(validateRegisterInput), registerUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;

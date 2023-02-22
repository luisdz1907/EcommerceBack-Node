const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  daleteProduct,
} = require("../controllers/productController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/create-product", authMiddleware, isAdmin, createProduct);
router.get("/:id", getProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.get("/", getAllProduct);
router.delete("/:id", authMiddleware, isAdmin, daleteProduct);

module.exports = router;

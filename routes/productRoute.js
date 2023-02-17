const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  daleteProduct,
} = require("../controllers/productController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create-product", authMiddleware, createProduct);
router.get("/:id", authMiddleware, getProduct);
router.put("/:id", authMiddleware, updateProduct);
router.get("/", getAllProduct);
router.delete("/:id", authMiddleware, daleteProduct);

module.exports = router;

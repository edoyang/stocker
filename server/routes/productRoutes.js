const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth"); // Import the auth middleware

router.post("/products", auth, productController.addProduct); // Protected route
router.get("/products", auth, productController.getAllProducts); // Protected route
router.get("/product/:barcode", auth, productController.getProductByBarcode); // Protected route
router.patch(
  "/product-update/:barcode",
  auth,
  productController.updateProductByBarcode
); // Protected route
router.get("/products/expired", auth, productController.getExpiredProducts); // Protected route
router.post(
  "/product/collect/:barcode",
  auth,
  productController.collectProductByBarcode
); // Protected route

module.exports = router;

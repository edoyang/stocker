const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: String,
  productBarcode: Number,
  productImage: String,
  expired: Boolean,
  expiryDate: Date,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

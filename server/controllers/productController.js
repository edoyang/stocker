const Product = require("../models/productModel");

// Add new product
exports.addProduct = async (req, res) => {
  const { productName, productBarcode, productImage, expired, expiryDate } =
    req.body;

  const product = new Product({
    productName,
    productBarcode,
    productImage,
    expired,
    expiryDate,
  });

  try {
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ message: "Error saving product", error });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products", error });
  }
};

// Get product by barcode
exports.getProductByBarcode = async (req, res) => {
  const barcode = req.params.barcode;

  try {
    const product = await Product.findOne({ productBarcode: barcode });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

// Update product by barcode
exports.updateProductByBarcode = async (req, res) => {
  const barcode = req.params.barcode;
  const { productName, productImage, expired, expiryDate } = req.body;

  try {
    const product = await Product.findOne({ productBarcode: barcode });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (productName) product.productName = productName;
    if (productImage) product.productImage = productImage;
    if (expired !== undefined) product.expired = expired;
    if (expiryDate) product.expiryDate = expiryDate;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Get expired products
exports.getExpiredProducts = async (req, res) => {
  try {
    const products = await Product.find({ expired: true }).lean();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving expired products:", error);
    res
      .status(500)
      .json({ message: "Error retrieving expired products", error });
  }
};

// Collect product by barcode
exports.collectProductByBarcode = async (req, res) => {
  const barcode = req.params.barcode;

  try {
    const product = await Product.findOne({ productBarcode: barcode });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.expired = false;
    product.expiryDate = null;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error collecting product:", error);
    res.status(500).json({ message: "Error collecting product", error });
  }
};

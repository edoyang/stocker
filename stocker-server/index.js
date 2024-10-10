const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI); // Debugging log

// Initialize the app
const app = express();

// Use CORS middleware to enable cross-origin requests
app.use(cors({ origin: [process.env.DASHBOARD_URL, process.env.MOBILE_URL] }));

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection and schema setup
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error); // Log connection error
  });

// Define the product schema
const productSchema = new mongoose.Schema({
  productName: String,
  productBarcode: Number,
  productImage: String,
  expired: Boolean,
  expiryDate: Date,
});

// Define the product model
const Product = mongoose.model("Product", productSchema);

// POST route to add new products
app.post("/api/products", async (req, res) => {
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
    console.error("Error saving product:", error); // Log error for debugging
    res.status(500).json({ message: "Error saving product", error });
  }
});

// GET route to retrieve all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().lean(); // Retrieve all products as plain objects
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error); // Log the actual error
    res.status(500).json({ message: "Error retrieving products", error });
  }
});

// GET route to retrieve a product by barcode
app.get("/api/product/:barcode", async (req, res) => {
  const barcode = req.params.barcode;

  try {
    const product = await Product.findOne({ productBarcode: barcode });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error retrieving product:", error); // Log error for debugging
    res.status(500).json({ message: "Error retrieving product", error });
  }
});

app.patch("/api/product-update/:barcode", async (req, res) => {
  const barcode = req.params.barcode;
  const { productName, productImage, expired, expiryDate } = req.body; // Destructure fields to update from the request body

  try {
    // Find the product by its barcode
    const product = await Product.findOne({ productBarcode: barcode });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product fields if they are provided in the request
    if (productName) product.productName = productName;
    if (productImage) product.productImage = productImage;
    if (expired !== undefined) product.expired = expired; // Ensure expired is explicitly checked for undefined
    if (expiryDate) product.expiryDate = expiryDate;

    // Save the updated product
    const updatedProduct = await product.save();

    // Respond with the updated product
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error); // Log error for debugging
    res.status(500).json({ message: "Error updating product", error });
  }
});

app.get("/api/products/expired", async (req, res) => {
  try {
    const products = await Product.find({ expired: true }).lean();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving expired products:", error);
    res
      .status(500)
      .json({ message: "Error retrieving expired products", error });
  }
});

app.post("/api/product/collect/:barcode", async (req, res) => {
  const barcode = req.params.barcode;

  try {
    // Find the product by its barcode
    const product = await Product.findOne({ productBarcode: barcode });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product: set expired to false and expiryDate to null
    product.expired = false;
    product.expiryDate = null;

    // Save the updated product
    const updatedProduct = await product.save();

    // Respond with the updated product
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error collecting product:", error); // Log error for debugging
    res.status(500).json({ message: "Error collecting product", error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

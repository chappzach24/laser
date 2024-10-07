const Product = require("../models/product.model");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stockQuantity } = req.body;

    const imageUrl = req.file ? req.file.path : null; 

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }
    
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      imageUrl, 
      stockQuantity
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
  try {
    console.log('Updating product:', req.params.id);
    console.log('Received data:', req.body);

    const updateData = { ...req.body };

    // Handle image update if a new file is uploaded
    if (req.file) {
      console.log('New image file:', req.file);
      updateData.imageUrl = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log('Updated product:', updatedProduct);
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json({ message: err.message });
  }
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

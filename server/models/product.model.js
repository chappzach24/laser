const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  imageUrl: { type: String, required: true },
  stockQuantity: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;


// Create a New Product: POST http://localhost:5000/api/products
// Get All Products: GET http://localhost:5000/api/products
// Get a Product by ID: GET http://localhost:5000/api/products/:id
// Update a Product by ID: PUT http://localhost:5000/api/products/:id
// Delete a Product by ID: DELETE http://localhost:5000/api/products/:id

// {
//     "name": "Sample",
//     "description": "sample product",
//     "price": 99.99,
//     "category": "test",
//     "imageUrl": "http://example.com/image.jpg",
//     "stockQuantity": 10
//   }
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  createdAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;



// Add a Product to the Cart: POST http://localhost:5000/api/cart
// Get Cart Items for a User: GET http://localhost:5000/api/cart/:userId
// Update Cart Item Quantity: PUT http://localhost:5000/api/cart/item
// Remove Item from Cart: DELETE http://localhost:5000/api/cart/:userId/item/:itemId

// {
//     "user": "668dd7f8ebd42ebec401aa59",  //User ID
//     "items": [
//       {
//         "product": "668de257ebd42ebec401aa69",  // Replace with actual Product ID
//         "quantity": 1
//       },
//       {
//         "product": "668de637ebd42ebec401aa7a",  // Replace with actual Product ID
//         "quantity": 1
//       }
//     ]
//   }
const Cart = require('../models/cart.model');

// Add a product to the cart
const addProductToCart = async (req, res) => {
  const { user, items } = req.body;
  try {
    let cart = await Cart.findOne({ user });
    if (!cart) {
      cart = new Cart({ user, items });
    } else {
      items.forEach(item => {
        const productIndex = cart.items.findIndex(p => p.product.toString() === item.product);
        if (productIndex > -1) {
          cart.items[productIndex].quantity += item.quantity;
        } else {
          cart.items.push(item);
        }
      });
    }
    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all carts
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate('user').populate('items.product');
    res.status(200).json(carts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a cart by user ID
const getCartByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ user: userId }).populate('user').populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a cart by user ID
const updateCartByUserId = async (req, res) => {
  const { userId } = req.params;
  const { items } = req.body;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.items = items;
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a cart by user ID
const deleteCartByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOneAndDelete({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addProductToCart,
  getAllCarts,
  getCartByUserId,
  updateCartByUserId,
  deleteCartByUserId,
};

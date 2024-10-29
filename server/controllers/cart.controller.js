const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const cartController = {
  getCart: async (req, res) => {
    try {
      const userId = req.params.userId;
      let cart = await Cart.findOne({ user: userId }).populate('items.product');
      if (!cart) {
        cart = new Cart({ user: userId, items: [], total: 0 });
        await cart.save();
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
  },

  addToCart: async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({ user: userId, items: [], total: 0 });
      }

      const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (cartItemIndex > -1) {
        cart.items[cartItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      cart.total = cart.items.reduce((total, item) => {
        return total + (item.quantity * product.price);
      }, 0);

      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
  },

  updateCartItem: async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (cartItemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }

      cart.items[cartItemIndex].quantity = quantity;
      if (quantity <= 0) {
        cart.items.splice(cartItemIndex, 1);
      }

      const products = await Product.find({ _id: { $in: cart.items.map(item => item.product) } });
      cart.total = cart.items.reduce((total, item) => {
        const product = products.find(p => p._id.toString() === item.product.toString());
        return total + (item.quantity * product.price);
      }, 0);

      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error updating cart item', error: error.message });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const { userId, productId } = req.params;
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      cart.items = cart.items.filter(item => item.product.toString() !== productId);
      const products = await Product.find({ _id: { $in: cart.items.map(item => item.product) } });
      cart.total = cart.items.reduce((total, item) => {
        const product = products.find(p => p._id.toString() === item.product.toString());
        return total + (item.quantity * product.price);
      }, 0);

      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
  }
};

module.exports = cartController;
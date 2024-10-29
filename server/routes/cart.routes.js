const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.get('/cart/:userId', cartController.getCart);
router.post('/cart', cartController.addToCart);
router.put('/cart', cartController.updateCartItem);
router.delete('/cart/:userId/:productId', cartController.removeFromCart);

module.exports = router;
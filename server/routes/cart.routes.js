const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/cart', cartController.addProductToCart);
router.get('/cart', cartController.getAllCarts);
router.get('/cart/:userId', cartController.getCartByUserId);
router.put('/cart/:userId', cartController.updateCartByUserId);
router.delete('/cart/:userId', cartController.deleteCartByUserId);

module.exports = router;

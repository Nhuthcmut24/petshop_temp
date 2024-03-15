const express = require('express');
const router = express.Router();
const cartController = require('../Controller/cartController');

router.get('/cart/:username', cartController.getCart);
router.post('/addToCart', cartController.addToCart);
router.delete('/deleteFromCart', cartController.deleteFromCart);
router.post('/intoOrder', cartController.intoOrder);
router.put('/updateQuantityInCart', cartController.updateQuantityInCart);

module.exports = router;
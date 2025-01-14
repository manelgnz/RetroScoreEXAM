const express = require('express');
const router = express.Router();
const { addToCart, getCartByUser, deleteFromCart, updateCartItem } = require('./cart.controllers');

router.post('/:jerseyId', addToCart); 
router.get('/:userId', getCartByUser); 
router.delete('/:jerseyId', deleteFromCart); 
router.put('/:jerseyId', updateCartItem);

module.exports = { cartRouter: router };
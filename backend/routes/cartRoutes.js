const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
} = require('../controllers/cartController');
const requireAuth = require('../middleware/authMiddleware');

// All cart routes require authentication
router.get('/', requireAuth, getCart);
router.post('/add', requireAuth, addToCart);
router.put('/update', requireAuth, updateCartItem);
router.delete('/remove/:itemId', requireAuth, removeCartItem);
router.delete('/clear', requireAuth, clearCart);
router.post('/merge', requireAuth, mergeCart);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  verifyPayment,
  handleRazorpayWebhook,
  getOrders,
  getOrderById,
} = require('../controllers/orderController');
const requireAuth = require('../middleware/authMiddleware');

// NOTE: Webhook route is handled in server.js with raw body parser
// Do NOT define it here to avoid conflicts

// Protected routes - Fixed Routes MUST come before dynamic routes

// POST Routes (fixed paths first)
router.post('/checkout', requireAuth, createCheckoutSession);
router.post('/verify-payment', requireAuth, verifyPayment);

// GET Routes (fixed paths first)
router.get('/', requireAuth, getOrders);

// Dynamic Route (MUST be last)
router.get('/:orderId', requireAuth, getOrderById);

module.exports = router;
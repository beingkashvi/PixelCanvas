const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user;
    const { shippingAddress } = req.body;

    // console.log('🔍 Checkout Request:', {
    //   userId: userId?.toString(),
    //   hasShippingAddress: !!shippingAddress,
    //   shippingAddress
    // });

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1 || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      console.log('❌ Invalid shipping address');
      return res.status(400).json({ error: 'Complete shipping address is required' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    // console.log('🛒 Cart found:', {
    //   exists: !!cart,
    //   itemCount: cart?.items?.length || 0,
    //   totalPrice: cart?.totalPrice
    // });

    if (!cart) {
      console.log('❌ No cart found for user');
      return res.status(400).json({ error: 'Cart not found' });
    }

    if (cart.items.length === 0) {
      console.log('❌ Cart is empty');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Filter out items with null/invalid products and validate
    const validItems = cart.items.filter(item => {
      if (!item.product) {
        console.warn(`⚠️ Skipping cart item with null product: ${item._id}`);
        return false;
      }
      return true;
    });

    // console.log('✅ Valid items:', {
    //   total: cart.items.length,
    //   valid: validItems.length,
    //   invalid: cart.items.length - validItems.length
    // });

    if (validItems.length === 0) {
      console.log('❌ No valid items after filtering');
      return res.status(400).json({ 
        error: 'No valid items in cart. Some products may have been removed.' 
      });
    }

    // If some items were invalid, update the cart
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      // Recalculate total
      cart.totalPrice = validItems.reduce((total, item) => total + (item.itemPrice * item.quantity), 0);
      await cart.save();
      
      console.log(`🔧 Removed ${cart.items.length - validItems.length} invalid items from cart`);
    }

    // Calculate totals
    const itemsTotal = cart.totalPrice;
    const shippingCost = calculateShipping(validItems.length);
    const tax = calculateTax(itemsTotal);
    const totalPrice = itemsTotal + shippingCost + tax;

    // console.log('💰 Order totals:', {
    //   itemsTotal,
    //   shippingCost,
    //   tax,
    //   totalPrice
    // });

    // Create order in database (pending)
    const order = new Order({
      user: userId,
      items: validItems.map(item => ({
        product: item.product._id,
        productName: item.productName,
        productSlug: item.productSlug,
        basePrice: item.basePrice,
        baseImageUrl: item.baseImageUrl,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        selectedFrame: item.selectedFrame,
        selectedDesign: item.selectedDesign,
        generatedImage: item.generatedImage,
        customText: item.customText,
        quantity: item.quantity,
        itemPrice: item.itemPrice,
        subtotal: item.itemPrice * item.quantity,
      })),
      shippingAddress,
      itemsTotal,
      shippingCost,
      tax,
      totalPrice,
      paymentStatus: 'pending',
      orderStatus: 'processing',
    });

    await order.save();
    console.log('✅ Order created:', order._id);

    // Create Razorpay order (amount in paise - multiply by 100)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100), // Convert to paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    console.log('✅ Razorpay order created:', razorpayOrder.id);

    // Save Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('❌ Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Verify Razorpay payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      const order = await Order.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Update order
      order.paymentStatus = 'paid';
      order.razorpayPaymentId = razorpay_payment_id;
      order.paidAt = new Date();
      await order.save();

      // Clear cart
      await Cart.findOneAndUpdate(
        { user: order.user },
        { items: [], totalPrice: 0 }
      );

      res.status(200).json({ 
        success: true, 
        message: 'Payment verified successfully',
        orderId: order._id 
      });
    } else {
      // Invalid signature
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
      }

      res.status(400).json({ 
        success: false, 
        error: 'Invalid payment signature' 
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Webhook handler for Razorpay events
const handleRazorpayWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  try {
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // Handle different events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      default:
        console.log(`Unhandled event: ${event}`);
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Handle payment captured
async function handlePaymentCaptured(payment) {
  try {
    const orderId = payment.notes.orderId;
    const order = await Order.findById(orderId);

    if (order && order.paymentStatus === 'pending') {
      order.paymentStatus = 'paid';
      order.razorpayPaymentId = payment.id;
      order.paidAt = new Date();
      await order.save();

      // Clear cart
      await Cart.findOneAndUpdate(
        { user: order.user },
        { items: [], totalPrice: 0 }
      );

      console.log('Payment captured for order:', order.orderNumber);
    }
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

// Handle payment failed
async function handlePaymentFailed(payment) {
  try {
    const orderId = payment.notes.orderId;
    const order = await Order.findById(orderId);

    if (order) {
      order.paymentStatus = 'failed';
      await order.save();
      console.log('Payment failed for order:', order.orderNumber);
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

// Get user's orders
const getOrders = async (req, res) => {
  try {
    const userId = req.user;
    
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product');
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const userId = req.user;
    const { orderId } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }
    
    const order = await Order.findOne({ 
      _id: orderId, 
      user: userId 
    }).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper functions
function calculateShipping(itemCount) {
  if (itemCount === 0) return 0;
  if (itemCount === 1) return 50; // ₹50 for 1 item
  if (itemCount <= 3) return 80; // ₹80 for 2-3 items
  return 120; // ₹120 for 4+ items
}

function calculateTax(subtotal) {
  // 18% GST (standard rate in India)
  return subtotal * 0.18;
}

function getItemDescription(item) {
  const parts = [];
  if (item.selectedColor) parts.push(`Color: ${item.selectedColor.name}`);
  if (item.selectedSize) parts.push(`Size: ${item.selectedSize.name}`);
  if (item.customText) parts.push(`Text: "${item.customText}"`);
  return parts.join(', ') || 'Custom product';
}

module.exports = {
  createCheckoutSession,
  verifyPayment,
  handleRazorpayWebhook,
  getOrders,
  getOrderById,
};
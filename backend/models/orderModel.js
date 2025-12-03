const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: { type: String, required: true },
  productSlug: { type: String, required: true },
  basePrice: { type: Number, required: true },
  baseImageUrl: { type: String, required: true },
  
  // Customization selections
  selectedColor: {
    name: String,
    hex: String,
  },
  selectedSize: {
    name: String,
    priceModifier: { type: Number, default: 0 },
  },
  selectedFrame: {
    name: String,
    hex: String,
  },
  selectedDesign: String,
  generatedImage: String,
  customText: String,
  
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  
  itemPrice: {
    type: Number,
    required: true,
  },
  
  // Total for this item (itemPrice * quantity)
  subtotal: {
    type: Number,
    required: true,
  },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  phone: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    orderNumber: {
      type: String,
      unique: true,
    },
    
    items: [orderItemSchema],
    
    shippingAddress: shippingAddressSchema,
    
    // Pricing
    itemsTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    
    // Payment info
    paymentMethod: {
      type: String,
      required: true,
      enum: ['razorpay'],
      default: 'razorpay',
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    
    // Order status
    orderStatus: {
      type: String,
      required: true,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
    
    // Timestamps
    paidAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
  },
  {
    timestamps: true,
  }
);

// Generate order number
orderSchema.pre('validate', async function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
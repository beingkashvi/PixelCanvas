const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
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
  selectedDesign: String, // URL for premade design
  generatedImage: String, // Base64 or URL for AI-generated image
  customText: String,
  
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  
  // Final price per item (basePrice + size modifier)
  itemPrice: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for guest carts
    },
    
    // For guest carts, we can use a session ID
    sessionId: {
      type: String,
      required: false,
    },
    
    items: [cartItemSchema],
    
    // Total cart value
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Method to calculate total price
cartSchema.methods.calculateTotal = function() {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + (item.itemPrice * item.quantity);
  }, 0);
  return this.totalPrice;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
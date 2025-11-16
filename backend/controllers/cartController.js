const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Get cart for logged-in user
const getCart = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware
    
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart) {
      // Create empty cart if none exists
      cart = await Cart.create({ user: userId, items: [] });
    }
    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user; // From auth middleware
    const {
      productId,
      productName,
      productSlug,
      basePrice,
      baseImageUrl,
      selectedColor,
      selectedSize,
      selectedFrame,
      selectedDesign,
      generatedImage,
      customText,
      quantity = 1,
    } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate item price
    const sizeModifier = selectedSize?.priceModifier || 0;
    const itemPrice = basePrice + sizeModifier;

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Check if identical item exists (same product + customizations)
    const existingItemIndex = cart.items.findIndex(item => {
      return (
        item.product.toString() === productId &&
        JSON.stringify(item.selectedColor) === JSON.stringify(selectedColor) &&
        JSON.stringify(item.selectedSize) === JSON.stringify(selectedSize) &&
        JSON.stringify(item.selectedFrame) === JSON.stringify(selectedFrame) &&
        item.selectedDesign === selectedDesign &&
        item.generatedImage === generatedImage &&
        item.customText === customText
      );
    });

    if (existingItemIndex > -1) {
      // Item exists, increment quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        productName,
        productSlug,
        basePrice,
        baseImageUrl,
        selectedColor,
        selectedSize,
        selectedFrame,
        selectedDesign,
        generatedImage,
        customText,
        quantity,
        itemPrice,
      });
    }

    // Recalculate total
    cart.calculateTotal();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user;
    const { itemId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    item.quantity = quantity;
    cart.calculateTotal();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    cart.calculateTotal();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user;
    
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Merge guest cart with user cart (called during login)
const mergeCart = async (req, res) => {
  try {
    const userId = req.user;
    const { guestCartItems } = req.body; // Array of cart items from localStorage

    if (!guestCartItems || guestCartItems.length === 0) {
      // No guest cart to merge, just return user's cart
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
      }
      return res.status(200).json(cart);
    }

    // Find or create user cart
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Merge guest items into user cart
    for (const guestItem of guestCartItems) {
      // Check if identical item exists
      const existingItemIndex = cart.items.findIndex(item => {
        return (
          item.product.toString() === guestItem.productId &&
          JSON.stringify(item.selectedColor) === JSON.stringify(guestItem.selectedColor) &&
          JSON.stringify(item.selectedSize) === JSON.stringify(guestItem.selectedSize) &&
          JSON.stringify(item.selectedFrame) === JSON.stringify(guestItem.selectedFrame) &&
          item.selectedDesign === guestItem.selectedDesign &&
          item.generatedImage === guestItem.generatedImage &&
          item.customText === guestItem.customText
        );
      });

      if (existingItemIndex > -1) {
        // Item exists, add quantities
        cart.items[existingItemIndex].quantity += guestItem.quantity;
      } else {
        // Add new item
        cart.items.push({
          product: guestItem.productId,
          productName: guestItem.productName,
          productSlug: guestItem.productSlug,
          basePrice: guestItem.basePrice,
          baseImageUrl: guestItem.baseImageUrl,
          selectedColor: guestItem.selectedColor,
          selectedSize: guestItem.selectedSize,
          selectedFrame: guestItem.selectedFrame,
          selectedDesign: guestItem.selectedDesign,
          generatedImage: guestItem.generatedImage,
          customText: guestItem.customText,
          quantity: guestItem.quantity,
          itemPrice: guestItem.itemPrice,
        });
      }
    }

    // Recalculate total
    cart.calculateTotal();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
};
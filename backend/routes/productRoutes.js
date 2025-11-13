const express = require('express');
const Product = require('../models/productModel.js');
const router = express.Router();

// GET /api/products
// Gets all products (or first 4 for homepage)
router.get('/', async (req, res) => {
  try {
    // We're fetching all products now, not just the old simple ones
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/products/main-category/:mainCategory
// This is the NEW endpoint for your sub-category pages.
// e.g., .../api/products/main-category/t-shirts
router.get('/main-category/:mainCategory', async (req, res) => {
  try {
    const products = await Product.find({
      mainCategory: req.params.mainCategory,
    });
    if (products.length > 0) {
      res.json(products);
    } else {
      res.status(404).json({ message: 'No products found in this category' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/products/slug/:slug
// This is the NEW endpoint for your final customizer page.
// e.g., .../api/products/slug/oversized-t-shirt
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- This route is no longer needed, we replaced it ---
// router.get('/category/:slug', ...);

module.exports = router;
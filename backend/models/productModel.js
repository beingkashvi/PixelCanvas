const mongoose = require('mongoose');

// This is our new, flexible customization options schema
const customizationOptionsSchema = {
  colors: [
    {
      name: { type: String, required: true },
      hex: { type: String, required: true },
    },
  ],
  sizes: [
    {
      name: { type: String, required: true },
      priceModifier: { type: Number, required: true, default: 0 },
    },
  ],
  frames: [
    {
      name: { type: String, required: true },
      hex: { type: String, required: true },
    },
  ],
  premadeDesigns: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
};

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Oversized T-Shirt"
    slug: { type: String, required: true, unique: true }, // e.g., "oversized-t-shirt"
    mainCategory: { type: String, required: true, index: true }, // e.g., "t-shirts"
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    baseImageUrl: { type: String, required: true },
    // We embed the new options schema here
    customizationOptions: customizationOptionsSchema,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
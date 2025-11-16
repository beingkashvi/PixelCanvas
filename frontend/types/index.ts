// This file defines the "shape" of our data in the frontend.

// --- Individual Customization Option Types ---
export interface ColorOption {
  name: string;
  hex: string;
}

export interface SizeOption {
  name: string;
  priceModifier: number;
}

export interface FrameOption {
  name: string;
  hex: string;
}

export interface DesignOption {
  name: string;
  url: string;
}

// --- Main Customization Object ---
export interface CustomizationOptions {
  colors?: ColorOption[];
  sizes?: SizeOption[];
  frames?: FrameOption[];
  premadeDesigns?: DesignOption[];
}

// --- The Main Product Type ---
export interface Product {
  _id: string;
  name: string;
  slug: string;
  mainCategory: string;
  description: string;
  basePrice: number;
  baseImageUrl: string;
  customizationOptions: CustomizationOptions;
  createdAt: string;
  updatedAt: string;
}

// --- Cart Item Type ---
export interface CartItem {
  _id?: string; // MongoDB ID (optional for guest carts)
  productId: string;
  productName: string;
  productSlug: string;
  basePrice: number;
  baseImageUrl: string;
  selectedColor?: ColorOption;
  selectedSize?: SizeOption;
  selectedFrame?: FrameOption;
  selectedDesign?: string; // URL
  generatedImage?: string; // Base64 or URL
  customText?: string;
  quantity: number;
  itemPrice: number; // basePrice + size modifier
}

// --- Cart Type ---
export interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}
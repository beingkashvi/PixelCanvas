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
// This now matches our new MongoDB model
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
"use client";

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Loader2,
  CheckCircle,
  Type,
  Palette,
  Layers,
  Square,
  Ruler,
  X,
} from 'lucide-react';
import { Product } from '@/types';

interface CustomizerPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`http://localhost:5001/api/products/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch product data');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export default function DynamicCustomizerPage({ params }: CustomizerPageProps) {
  const resolvedParams = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  // Customization State
  const [selectedColor, setSelectedColor] = useState<{
    name: string;
    hex: string;
  } | null>(null);
  const [customColorHex, setCustomColorHex] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedSize, setSelectedSize] = useState<{
    name: string;
    priceModifier: number;
  } | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<{
    name: string;
    hex: string;
  } | null>(null);

  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');

  // UI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);
      const productData = await getProductBySlug(resolvedParams.slug);
      setProduct(productData);

      if (productData) {
        const options = productData.customizationOptions;
        if (options.colors && options.colors.length > 0) {
          setSelectedColor(options.colors[0]);
        }
        if (options.sizes && options.sizes.length > 0) {
          setSelectedSize(options.sizes[0]);
        }
        if (options.frames && options.frames.length > 0) {
          setSelectedFrame(options.frames[0]);
        }
      }
      setLoadingProduct(false);
    };

    fetchProduct();
  }, [resolvedParams.slug]);

  const handleGenerateImage = async () => {
    if (!aiPrompt) {
      setError('Please enter a prompt for the AI.');
      return;
    }
    setIsGenerating(true);
    setError(null);
    setSelectedDesign(null);
    setGeneratedImage(null);

    const apiKey = '';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    const payload = {
      instances: [{ prompt: aiPrompt }],
      parameters: { sampleCount: 1, aspectRatio: '1:1' },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      const result = await response.json();
      if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
        setGeneratedImage(
          `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`
        );
      } else {
        throw new Error('No image data returned from API.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectDesign = (url: string) => {
    setGeneratedImage(null);
    setSelectedDesign(url);
  };

  const handleCustomColorSelect = () => {
    setSelectedColor({
      name: 'Custom',
      hex: customColorHex,
    });
    setShowColorPicker(false);
  };

  const handleAddToCart = () => {
    const finalPrice =
      (product?.basePrice || 0) + (selectedSize?.priceModifier || 0);

    console.log('--- ITEM ADDED TO CART ---');
    console.log('Product:', product?.name);
    console.log('Price:', finalPrice);
    if (selectedColor) console.log('Color:', selectedColor.name);
    if (selectedSize) console.log('Size:', selectedSize.name);
    if (selectedFrame) console.log('Frame:', selectedFrame.name);
    if (generatedImage) console.log('Design:', 'AI Generated');
    if (selectedDesign) console.log('Design:', 'Pre-made');
    if (customText) console.log('Custom Text:', customText);

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  if (loadingProduct) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-2xl text-red-400">Product not found.</p>
      </div>
    );
  }

  const finalPrice = product.basePrice + (selectedSize?.priceModifier || 0);
  const options = product.customizationOptions;

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* --- Image Canvas Column (Left) --- */}
          <div
            className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-300"
            style={{
              border: selectedFrame
                ? `16px solid ${selectedFrame.hex}`
                : 'none',
              boxShadow: selectedFrame ? '0 0 15px rgba(0,0,0,0.5)' : 'none',
            }}
            
          >
            {/* Base Product Image with Color Filter */}
            <div className="relative w-full h-full">
            <Image
                src={product.baseImageUrl}
                alt={product.name}
                fill
                className="object-contain transition-all duration-300"
                style={{
                  filter: selectedColor 
                    ? 'grayscale(100%) brightness(0.52) contrast(2.5)'
                    : 'none',
                }}
                priority
              />
              
              {/* Color overlay mask - only affects the product */}
              {selectedColor && (
                <>
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: selectedColor.hex,
                      mixBlendMode: 'multiply',
                      opacity: 0.85,
                      maskImage: `url(${product.baseImageUrl})`,
                      WebkitMaskImage: `url(${product.baseImageUrl})`,
                      maskSize: 'contain',
                      WebkitMaskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center',
                    }}
                  />
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${selectedColor.hex}ee, ${selectedColor.hex}cc)`,
                      mixBlendMode: 'color',
                      opacity: 0.6,
                      maskImage: `url(${product.baseImageUrl})`,
                      WebkitMaskImage: `url(${product.baseImageUrl})`,
                      maskSize: 'contain',
                      WebkitMaskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center',
                    }}
                  />
                </>
              )}
            </div>

            {/* Design Overlay (Pre-made or AI) */}
            <div className="absolute inset-0">
              {(generatedImage || selectedDesign) && (
                <Image
                  src={generatedImage || selectedDesign || ''}
                  alt="Custom design"
                  fill
                  className="object-contain p-20"
                />
              )}
              {/* Custom Text Overlay */}
              {customText && (
                <div className="absolute inset-0 flex items-center justify-center p-20">
                  <span
                    className="text-4xl font-bold text-white"
                    style={{ 
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8), -2px -2px 4px rgba(0,0,0,0.8)',
                      WebkitTextStroke: '1px black'
                    }}
                  >
                    {customText}
                  </span>
                </div>
              )}
            </div>

            {/* Loading Spinner */}
            {isGenerating && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black bg-opacity-70">
                <Loader2 className="h-16 w-16 animate-spin text-white" />
                <p className="mt-4 text-white">Generating your design...</p>
              </div>
            )}
          </div>

          {/* --- Options Column (Right) --- */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              {product.name}
            </h1>
            <p className="text-3xl text-gray-300">${finalPrice.toFixed(2)}</p>

            {/* Color Selector - Always show for all products */}
            <div>
              <h3 className="flex items-center text-lg font-medium text-white">
                <Palette className="mr-2 h-5 w-5" />
                Color: {selectedColor?.name || 'Select a color'}
              </h3>
              <div className="mt-2 flex space-x-2 items-center">
                {options.colors && options.colors.length > 0 && options.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border-2 ${
                      selectedColor?.name === color.name && selectedColor.name !== 'Custom'
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900'
                        : 'border-gray-700'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
                {/* Custom Color Picker Button - Always available */}
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${
                    selectedColor?.name === 'Custom'
                      ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900'
                      : 'border-gray-700'
                  }`}
                  style={{ 
                    backgroundColor: selectedColor?.name === 'Custom' ? selectedColor.hex : '#1f2937',
                  }}
                >
                  <Palette className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* Color Picker Popup */}
              {showColorPicker && (
                <div className="mt-3 rounded-lg border border-gray-700 bg-gray-800 p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customColorHex}
                      onChange={(e) => setCustomColorHex(e.target.value)}
                      className="h-10 w-20 cursor-pointer rounded border-2 border-gray-600"
                    />
                    <input
                      type="text"
                      value={customColorHex}
                      onChange={(e) => setCustomColorHex(e.target.value)}
                      placeholder="#000000"
                      className="flex-1 rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleCustomColorSelect}
                      className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Size Selector */}
            {options.sizes && options.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center text-lg font-medium text-white">
                    <Square className="mr-2 h-5 w-5" />
                    Size: {selectedSize?.name}
                  </h3>
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="flex items-center text-sm text-blue-400 hover:text-blue-300"
                  >
                    <Ruler className="mr-1 h-4 w-4" />
                    Size Chart
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {options.sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-md border-2 px-4 py-2 text-sm font-medium ${
                        selectedSize?.name === size.name
                          ? 'border-blue-500 bg-blue-900 text-white'
                          : 'border-gray-700 bg-gray-800 text-gray-300'
                      }`}
                    >
                      {size.name}
                      {size.priceModifier > 0 && ` (+$${size.priceModifier})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Frame Selector */}
            {options.frames && options.frames.length > 0 && (
              <div>
                <h3 className="flex items-center text-lg font-medium text-white">
                  <Palette className="mr-2 h-5 w-5" />
                  Frame: {selectedFrame?.name}
                </h3>
                <div className="mt-2 flex space-x-2">
                  {options.frames.map((frame) => (
                    <button
                      key={frame.name}
                      onClick={() => setSelectedFrame(frame)}
                      className={`h-8 w-8 rounded-full border-2 ${
                        selectedFrame?.name === frame.name
                          ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900'
                          : 'border-gray-700'
                      }`}
                      style={{ backgroundColor: frame.hex }}
                    >
                      <span className="sr-only">{frame.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pre-made Designs */}
            {options.premadeDesigns && options.premadeDesigns.length > 0 && (
              <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
                <h3 className="flex items-center text-lg font-medium text-white">
                  <Layers className="mr-2 h-5 w-5" />
                  Choose a Design
                </h3>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {options.premadeDesigns.map((design) => (
                    <button
                      key={design.name}
                      onClick={() => handleSelectDesign(design.url)}
                      className={`overflow-hidden rounded-md border-2 ${
                        selectedDesign === design.url
                          ? 'border-blue-500'
                          : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={design.url}
                        alt={design.name}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Design */}
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
              <label
                htmlFor="ai-prompt"
                className="flex items-center text-lg font-medium text-white"
              >
                <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
                Or Generate with AI
              </label>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., A happy cat wearing a hat"
                  className="flex-1 rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  onClick={handleGenerateImage}
                  disabled={isGenerating}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            </div>

            {/* Add Text */}
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
              <label
                htmlFor="custom-text"
                className="flex items-center text-lg font-medium text-white"
              >
                <Type className="mr-2 h-5 w-5" />
                Add Custom Text
              </label>
              <input
                type="text"
                id="custom-text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Your text here..."
                className="mt-3 w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full rounded-md bg-green-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-green-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </main>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative max-w-4xl w-full bg-gray-800 rounded-lg">
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Size Chart</h2>
              <div className="relative w-full h-[500px]">
                <Image
                  src="/images/size-chart.png"
                  alt="Size Chart"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "Add to Cart" Toast Notification */}
      <div
        className={`fixed bottom-4 right-4 z-50 flex items-center rounded-lg bg-gray-800 p-4 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 ${
          showSuccessToast
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0'
        }`}
      >
        <CheckCircle className="h-6 w-6 text-green-400" />
        <p className="ml-3 font-medium text-white">
          Added to cart successfully!
        </p>
      </div>
    </>
  );
}
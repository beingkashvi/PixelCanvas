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
import { useCart } from '@/context/CartContext';

interface CustomizerPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`http://localhost:5001/api/products/slug/${slug}`, {
      cache: 'no-store',
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

export default function DynamicCustomizerPage({ params }: CustomizerPageProps) {
  const resolvedParams = use(params);
  const { addToCart } = useCart();

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
    if (!aiPrompt.trim()) {
      setError('Please enter a prompt for the AI.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setSelectedDesign(null); // Clear premade design if AI is generating
    setGeneratedImage(null);

    try {
      // Call backend API (connected to Pollinations)
      const response = await fetch('http://localhost:5001/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else {
        throw new Error('No image returned from API');
      }
    } catch (err: any) {
      console.error('AI Generation error:', err);
      setError(err.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectDesign = (url: string) => {
    setGeneratedImage(null); // Clear AI-generated image
    setSelectedDesign(url);
  };

  const handleCustomColorSelect = () => {
    setSelectedColor({
      name: 'Custom',
      hex: customColorHex,
    });
    setShowColorPicker(false);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const finalPrice = product.basePrice + (selectedSize?.priceModifier || 0);

    const cartItem = {
      productId: product._id,
      productName: product.name,
      productSlug: product.slug,
      basePrice: product.basePrice,
      baseImageUrl: product.baseImageUrl,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
      selectedFrame: selectedFrame || undefined,
      selectedDesign: selectedDesign || undefined,
      generatedImage: generatedImage || undefined,
      customText: customText || undefined,
      quantity: 1,
      itemPrice: finalPrice,
    };

    await addToCart(cartItem);

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  if (loadingProduct) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-2xl text-red-500">Product not found.</p>
      </div>
    );
  }

  const finalPrice = product.basePrice + (selectedSize?.priceModifier || 0);
  const options = product.customizationOptions;

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
          {/* --- Image Canvas Column (Left) --- */}
          <div
            className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 shadow-2xl"
            style={{
              border: selectedFrame
                ? `16px solid ${selectedFrame.hex}`
                : 'none',
              boxShadow: selectedFrame 
                ? '0 20px 60px rgba(0,0,0,0.3)' 
                : '0 20px 60px rgba(139, 92, 246, 0.3)',
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
                    ? 'grayscale(50%) brightness(0.7) contrast(2.5)'
                    : 'none',
                }}
                priority
              />
              
              {/* Color overlay mask */}
              {selectedColor && (
                <>
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: selectedColor.hex,
                      mixBlendMode: 'multiply',
                      opacity: 0.9,
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

            {/* Design Overlay (AI-generated or premade) */}
            <div className="absolute inset-0 flex items-center justify-center">
              {(generatedImage || selectedDesign) && (
                <div className="relative w-1/4 h-1/3 transform flex items-center justify-center">
                  <Image
                    src={generatedImage || selectedDesign || ''}
                    alt="Custom design"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              )}
            </div>

            {/* Custom Text Overlay - FIX: Constrained width and word-break */}
            {customText && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span
                  className="text-3xl font-bold text-white px-2 break-words"
                  style={{ 
                    textShadow: '2px 2px 5px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.7)',
                    WebkitTextStroke: '1px black',
                    fontFamily: 'Comfortaa, sans-serif',
                    maxWidth: '40%', // RESTRICTED to 40% of container width (fits on shirt torso)
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {customText}
                </span>
              </div>
            )}

            {/* Loading Spinner for AI Generation */}
            {isGenerating && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl">
                <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
                <p className="mt-4 text-gray-800 font-semibold animate-pulse">Creating your masterpiece...</p>
                <p className="mt-2 text-sm text-gray-600">Generating with Flux Model...</p>
              </div>
            )}
          </div>

          {/* --- Options Column (Right) --- */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-gray-800" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              {product.name}
            </h1>
            <p className="text-4xl font-bold text-purple-600">₹{finalPrice.toFixed(2)}</p>

            {/* Color Selector */}
            <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-purple-100">
              <h3 className="flex items-center text-lg font-bold text-gray-800 mb-4">
                <Palette className="mr-2 h-5 w-5 text-purple-500" />
                Color: {selectedColor?.name || 'Select a color'}
              </h3>
              <div className="flex space-x-3 items-center flex-wrap gap-2">
                {options.colors && options.colors.length > 0 && options.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`h-10 w-10 rounded-full border-3 transition-all ${
                      selectedColor?.name === color.name && selectedColor.name !== 'Custom'
                        ? 'border-purple-500 ring-4 ring-purple-200 scale-110'
                        : 'border-purple-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className={`h-10 w-10 rounded-full border-3 flex items-center justify-center transition-all ${
                    selectedColor?.name === 'Custom'
                      ? 'border-purple-500 ring-4 ring-purple-200 scale-110'
                      : 'border-purple-200 hover:scale-105'
                  }`}
                  style={{ 
                    backgroundColor: selectedColor?.name === 'Custom' ? selectedColor.hex : '#f3f4f6',
                  }}
                >
                  <Palette className="h-5 w-5 text-purple-600" />
                </button>
              </div>

              {showColorPicker && (
                <div className="mt-4 rounded-xl bg-purple-50 p-4 border-2 border-purple-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customColorHex}
                      onChange={(e) => setCustomColorHex(e.target.value)}
                      className="h-12 w-20 cursor-pointer rounded-lg border-2 border-purple-300"
                    />
                    <input
                      type="text"
                      value={customColorHex}
                      onChange={(e) => setCustomColorHex(e.target.value)}
                      placeholder="#000000"
                      className="flex-1 rounded-lg border-2 border-purple-200 bg-white px-4 py-2 text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all"
                    />
                    <button
                      onClick={handleCustomColorSelect}
                      className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 font-bold text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Size Selector */}
            {options.sizes && options.sizes.length > 0 && (
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center text-lg font-bold text-gray-800">
                    <Square className="mr-2 h-5 w-5 text-purple-500" />
                    Size: {selectedSize?.name}
                  </h3>
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="flex items-center text-sm text-purple-600 hover:text-pink-600 font-semibold transition-colors"
                  >
                    <Ruler className="mr-1 h-4 w-4" />
                    Size Chart
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {options.sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-xl border-2 px-5 py-3 text-sm font-bold transition-all ${
                        selectedSize?.name === size.name
                          ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                          : 'border-purple-200 bg-white text-gray-700 hover:border-purple-400'
                      }`}
                    >
                      {size.name}
                      {size.priceModifier > 0 && ` (+₹${size.priceModifier})`}
                    </button>
                  ))}
                </div>
              </div>
            )}


            {/* Pre-made Designs */}
            {options.premadeDesigns && options.premadeDesigns.length > 0 && (
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-purple-100">
                <h3 className="flex items-center text-lg font-bold text-gray-800 mb-4">
                  <Layers className="mr-2 h-5 w-5 text-purple-500" />
                  Choose a Design
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {options.premadeDesigns.map((design) => (
                    <button
                      key={design.name}
                      onClick={() => handleSelectDesign(design.url)}
                      className={`overflow-hidden rounded-xl border-3 transition-all hover:scale-105 ${
                        selectedDesign === design.url
                          ? 'border-purple-500 ring-4 ring-purple-200'
                          : 'border-purple-200'
                      }`}
                    >
                      <Image
                        src={design.url}
                        alt={design.name}
                        width={150}
                        height={100}
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Design Generation */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-lg border-2 border-purple-200">
              <label
                htmlFor="ai-prompt"
                className="flex items-center text-lg font-bold text-gray-800 mb-4"
              >
                <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                Or Generate with AI
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerateImage()}
                  placeholder="e.g., A happy cat wearing a hat"
                  className="flex-1 rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all"
                  disabled={isGenerating}
                />
                <button
                  onClick={handleGenerateImage}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {isGenerating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg p-2">
                  {error}
                </p>
              )}
              <p className="mt-3 text-xs text-gray-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-500" />
                Powered by Pollinations AI (Flux Model) • Unlimited Free Generations
              </p>
            </div>

            {/* Add Custom Text */}
            <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-purple-100">
              <label
                htmlFor="custom-text"
                className="flex items-center text-lg font-bold text-gray-800 mb-4"
              >
                <Type className="mr-2 h-5 w-5 text-purple-500" />
                Add Custom Text
              </label>
              <input
                type="text"
                id="custom-text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Your text here..."
                maxLength={50}
                className="w-full rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all"
              />
              {customText && (
                <p className="mt-2 text-xs text-gray-500">
                  {customText.length}/50 characters
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full rounded-full bg-gradient-to-r from-green-400 to-green-500 px-8 py-5 text-xl font-bold text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </main>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative max-w-4xl w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-purple-200">
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute right-6 top-6 text-gray-600 hover:text-gray-800 bg-white rounded-full p-2 shadow-lg"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Size Chart
              </h2>
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden">
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

      {/* Success Toast */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-center rounded-2xl bg-white/95 backdrop-blur-md p-5 shadow-2xl border-2 border-green-200 transition-all duration-300 ${
          showSuccessToast
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0'
        }`}
      >
        <CheckCircle className="h-7 w-7 text-green-500" />
        <p className="ml-3 font-bold text-gray-800">
          Added to cart successfully!
        </p>
      </div>
    </>
  );
}
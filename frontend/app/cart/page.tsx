"use client";

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { userInfo } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <ShoppingBag className="h-24 w-24 text-purple-300" />
        <h2 className="mt-6 text-3xl font-bold text-gray-800" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          Your cart is empty
        </h2>
        <p className="mt-2 text-gray-600">Add some amazing custom products!</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
          Start Shopping
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (userInfo) {
      router.push('/checkout');
    } else {
      router.push('/login?redirect=/checkout');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          Shopping Cart
        </h1>
        {cart.items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm text-white hover:text-red-600 font-semibold transition-colors"
          >
            Clear Cart
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-lg border border-purple-100"
            >
              <div className="flex gap-6">
                {/* --- Product Image Thumbnail (Fixed Ratio) --- */}
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                  {/* 1. Base Product Image */}
                  <Image
                    src={item.baseImageUrl}
                    alt={item.productName}
                    fill
                    className="object-contain"
                  />

                  {/* 2. Color Filter (Matches Customizer) */}
                  {item.selectedColor && (
                    <>
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: item.selectedColor.hex,
                          mixBlendMode: 'multiply',
                          opacity: 0.9,
                          maskImage: `url(${item.baseImageUrl})`,
                          WebkitMaskImage: `url(${item.baseImageUrl})`,
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
                          background: `linear-gradient(135deg, ${item.selectedColor.hex}ee, ${item.selectedColor.hex}cc)`,
                          mixBlendMode: 'color',
                          opacity: 0.6,
                          maskImage: `url(${item.baseImageUrl})`,
                          WebkitMaskImage: `url(${item.baseImageUrl})`,
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

                  {/* 3. Design Overlay (Correctly Scaled like Customizer) */}
{(item.selectedDesign || item.generatedImage) && (
  <div className="absolute inset-0 flex items-center justify-center">
    <div 
      className={`relative ${
        item.productSlug?.includes('tote')|| item.productName?.toLowerCase().includes('tote')
          ? 'w-2/5 h-2/5 transform translate-y-1/3'  // Larger and centered for tote bags
          : 'w-1/4 h-1/3'   // Smaller for other products
      }`}
    >
      <Image
        src={item.selectedDesign || item.generatedImage || ''}
        alt="Design"
        fill
        className="object-contain drop-shadow-md"
      />
    </div>
  </div>
)}

                  {/* 4. Text Overlay (Miniaturized) */}
                  {item.customText && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span
                        className="text-[10px] font-bold text-white px-1"
                        style={{
                          textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
                          WebkitTextStroke: '0.5px black',
                          fontFamily: 'Comfortaa, sans-serif',
                          maxWidth: '90%',
                          textAlign: 'center',
                          lineHeight: 1.1,
                        }}
                      >
                        {item.customText}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        <Link
                          href={`/shop/${item.productSlug}`}
                          className="hover:text-purple-600 transition-colors"
                        >
                          {item.productName}
                        </Link>
                      </h3>
                      
                      {/* Customization Details */}
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        {item.selectedColor && (
                          <div className="flex items-center gap-2">
                            <span>Color:</span>
                            <div
                              className="h-4 w-4 rounded-full border-2 border-purple-200"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            <span>{item.selectedColor.name}</span>
                          </div>
                        )}
                        {item.selectedSize && (
                          <p>Size: {item.selectedSize.name}</p>
                        )}
                        {item.selectedFrame && (
                          <p>Frame: {item.selectedFrame.name}</p>
                        )}
                        {item.customText && (
                          <p>Text: &quot;{item.customText}&quot;</p>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <p className="text-lg font-bold text-purple-600">
                    ₹{item.itemPrice.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id!, Math.max(1, item.quantity - 1))}
                        className="rounded-lg bg-purple-100 p-2 text-purple-600 hover:bg-purple-200 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id!, item.quantity + 1)}
                        className="rounded-lg bg-purple-100 p-2 text-purple-600 hover:bg-purple-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id!)}
                      className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-semibold transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>

                  {/* Subtotal for this item */}
                  <div className="mt-2 text-right text-sm text-gray-600">
                    Subtotal: ₹{(item.itemPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-lg border border-purple-100">
            <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Order Summary
            </h2>
            
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">₹{cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-sm">Calculated at checkout</span>
              </div>
              <div className="border-t-2 border-purple-100 pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-purple-600">₹{cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              {userInfo ? 'Proceed to Checkout' : 'Sign In to Checkout'}
            </button>

            {/* Continue Shopping */}
            <Link
              href="/"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-purple-200 bg-white px-6 py-3 font-semibold text-purple-600 hover:bg-purple-50 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { userInfo } = useAuth();

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          Shopping Cart
        </h1>
        {cart.items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm text-white border-purple-200 hover:text-red-600 font-semibold transition-colors"
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
                {/* Product Image */}
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                  <Image
                    src={item.baseImageUrl}
                    alt={item.productName}
                    fill
                    className="object-contain"
                  />
                  {(item.selectedDesign || item.generatedImage) && (
                    <div className="absolute inset-0">
                      <Image
                        src={item.selectedDesign || item.generatedImage || ''}
                        alt="Design"
                        fill
                        className="object-contain p-4"
                      />
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
                      ${item.itemPrice.toFixed(2)}
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
                    Subtotal: ${(item.itemPrice * item.quantity).toFixed(2)}
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
                <span className="font-semibold">${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-sm">Calculated at checkout</span>
              </div>
              <div className="border-t-2 border-purple-100 pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-purple-600">${cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            {userInfo ? (
              <button className="mt-6 w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                Proceed to Checkout
              </button>
            ) : (
              <div className="mt-6 space-y-3">
                <p className="text-center text-sm text-gray-600">
                  Sign in to checkout
                </p>
                <Link
                  href="/login"
                  className="block w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-center font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block w-full rounded-full border-2 border-purple-300 bg-white px-6 py-4 text-center font-bold text-purple-600 hover:bg-purple-50 transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}

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
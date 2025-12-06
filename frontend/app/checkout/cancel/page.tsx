"use client";

import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-gray-700 bg-white p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
          <XCircle className="h-12 w-12 text-red-400" />
        </div>

        <h1 className="mb-2 text-4xl font-bold text-black">
          Checkout Cancelled
        </h1>
        <p className="mb-8 text-gray-400">
          Your order was not completed. Your cart items are still saved.
        </p>

        <div className="mb-8 rounded-lg border border-yellow-500/30 bg-pink-500/10 p-6">
          <p className="text-sm text-gray-500">
            Don&apos;t worry! Your cart items are still there. You can review your
            order and try again whenever you&apos;re ready.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 mt-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Cart
          </Link>
          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-2 rounded-full border-2 border-purple-200 bg-white px-6 py-3 font-semibold text-purple-600 hover:bg-purple-50 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
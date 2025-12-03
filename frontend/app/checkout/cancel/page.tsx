"use client";

import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
          <XCircle className="h-12 w-12 text-red-400" />
        </div>

        <h1 className="mb-2 text-4xl font-bold text-white">
          Checkout Cancelled
        </h1>
        <p className="mb-8 text-gray-400">
          Your order was not completed. Your cart items are still saved.
        </p>

        <div className="mb-8 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-6">
          <p className="text-sm text-gray-300">
            Don&apos;t worry! Your cart items are still there. You can review your
            order and try again whenever you&apos;re ready.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 rounded-md border border-gray-600 bg-gray-700 px-6 py-3 font-medium text-white hover:bg-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Cart
          </Link>
          <Link
            href="/"
            className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
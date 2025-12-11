"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Loader2 } from 'lucide-react';

// Separate component that uses useSearchParams
function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          console.error('Failed to fetch order');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <p className="text-2xl text-red-400">Order not found</p>
        <Link href="/" className="mt-4 text-blue-400 hover:text-blue-300">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle className="h-12 w-12 text-green-400" />
        </div>

        <h1 className="mb-2 text-4xl font-bold text-white">Order Confirmed!</h1>
        <p className="mb-8 text-gray-400">
          Thank you for your purchase. Your order has been received.
        </p>

        {/* Order Details */}
        <div className="mb-8 rounded-lg border border-gray-700 bg-gray-900 p-6 text-left">
          <div className="mb-4 flex items-center justify-between border-b border-gray-700 pb-4">
            <div>
              <p className="text-sm text-gray-400">Order Number</p>
              <p className="text-xl font-bold text-white">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-xl font-bold text-white">
                ${order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-400">Shipping To:</p>
            <div className="text-white">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="mb-3 text-sm font-medium text-gray-400">Order Items:</p>
            <div className="space-y-2">
              {order.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between text-sm text-white"
                >
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                  <span>${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="mb-8 rounded-lg border border-blue-500/30 bg-blue-500/10 p-6">
          <div className="flex items-start gap-4">
            <Package className="h-8 w-8 flex-shrink-0 text-blue-400" />
            <div className="text-left">
              <h3 className="mb-2 text-lg font-semibold text-white">
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• You&apos;ll receive an email confirmation shortly</li>
                <li>• We&apos;ll start processing your custom items</li>
                <li>• You&apos;ll get tracking info once shipped</li>
                <li>• Estimated delivery: 5-7 business days</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/orders"
            className="rounded-md border border-gray-600 bg-gray-700 px-6 py-3 font-medium text-white hover:bg-gray-600"
          >
            View Order History
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

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-white" />
    </div>
  );
}

// Main page component with Suspense boundary
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
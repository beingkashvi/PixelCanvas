"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Loader2, ShoppingBag } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  items: any[];
  totalPrice: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  shippingAddress: any;
}

export default function OrdersPage() {
  const { userInfo, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !userInfo) {
      router.push('/login?redirect=/orders');
      return;
    }

    if (userInfo) {
      fetchOrders();
    }
  }, [userInfo, authLoading, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/orders', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      case 'processing':
        return 'text-blue-400';
      case 'shipped':
        return 'text-purple-400';
      case 'delivered':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading || authLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <ShoppingBag className="h-24 w-24 text-gray-600" />
        <h2 className="mt-6 text-3xl font-bold text-white">No orders yet</h2>
        <p className="mt-2 text-gray-400">
          Start shopping and your orders will appear here!
        </p>
        <Link
          href="/"
          className="mt-8 rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-8 text-4xl font-bold text-white">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-lg border border-gray-700 bg-gray-800 p-6"
          >
            {/* Order Header */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-700 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Order #{order.orderNumber}
                </h3>
                <p className="text-sm text-gray-400">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">
                  ${order.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="mb-4 flex gap-3">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                  order.paymentStatus
                )}`}
              >
                Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                Order: {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
            </div>

            {/* Order Items */}
            <div className="mb-4 space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-700">
                    <Image
                      src={item.baseImageUrl}
                      alt={item.productName}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">
                      {item.productName}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Quantity: {item.quantity} × ${item.itemPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className="mb-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
              <p className="mb-2 text-sm font-medium text-gray-400">
                Shipping To:
              </p>
              <div className="text-sm text-white">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
              </div>
            </div>

            {/* View Details Button */}
            <Link
              href={`/orders/${order._id}`}
              className="flex items-center justify-center gap-2 rounded-md border border-gray-600 bg-gray-700 px-4 py-2 font-medium text-white hover:bg-gray-600"
            >
              <Package className="h-4 w-4" />
              View Order Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
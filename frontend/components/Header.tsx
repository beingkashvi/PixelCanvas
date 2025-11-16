"use client";

import Link from 'next/link';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { userInfo, logout, loading } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-purple-100 shadow-sm">
      <div className="container mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 transition-colors hover:text-purple-600"
          style={{ fontFamily: 'Comfortaa, sans-serif' }}
        >
          PrintShop
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/shop/apparel"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
          >
            Apparel
          </Link>
          <Link
            href="/shop/drinkware"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
          >
            Drinkware
          </Link>
          <Link
            href="/shop/accessories"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
          >
            Accessories
          </Link>
          <Link
            href="/shop/home-living"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
          >
            Home & Living
          </Link>
        </nav>

        {/* AUTH & CART LOGIC */}
        <div className="flex items-center space-x-4">
          {!loading && (
            <>
              {userInfo ? (
                // --- USER IS LOGGED IN ---
                <div className="flex items-center space-x-4">
                  <span className="hidden items-center text-sm font-medium text-gray-700 md:flex">
                    <User className="mr-1 h-4 w-4" />
                    Hi, {userInfo.firstName && userInfo.firstName.split(' ')[0]}
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-600"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                // --- USER IS LOGGED OUT ---
                <>
                  <Link
                    href="/login"
                    className="hidden rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-600 md:block"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="hidden rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 md:block"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative rounded-full p-2 text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-600"
            aria-label="Open cart"
          >
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-bold text-white shadow-lg">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
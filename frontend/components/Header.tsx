import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto flex max-w-7xl items-center justify-between p-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-white transition-colors hover:text-blue-400"
        >
          PrintShop
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/shop/apparel"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400"
          >
            Apparel
          </Link>
          <Link
            href="/shop/drinkware"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400"
          >
            Drinkware
          </Link>
          <Link
            href="/shop/accessories"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400"
          >
            Accessories
          </Link>
        </nav>

        {/* RIGHT SIDE: Auth Buttons + Cart */}
        <div className="flex items-center space-x-4">

          {/* Login */}
          <Link
            href="/login"
            className="hidden rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-blue-400 hover:bg-gray-800 md:block"
          >
            Login
          </Link>

          {/* Sign Up */}
          <Link
            href="/signup"
            className="hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 md:block"
          >
            Sign Up
          </Link>

          {/* Cart Icon */}
          <button
            aria-label="Open cart"
            className="relative rounded-full p-2 text-gray-300 transition-colors hover:bg-gray-800 hover:text-blue-400"
          >
            <ShoppingBag size={22} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

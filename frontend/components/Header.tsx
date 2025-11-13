import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo/Home Link */}
        <Link
          href="/"
          className="text-2xl font-bold text-white transition-colors hover:text-blue-400"
        >
          PrintShop
        </Link>

        {/* --- LINKS UPDATED TO MATCH NEW CATEGORIES --- */}
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
          {/* <Link
            href="/shop/prints"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400"
          >
            Prints
          </Link> */}
        </nav>

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
    </header>
  );
}
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import Link from 'next/link';

// --- Category Data (Updated to match new structure) ---
const categories = [
  {
    name: 'Apparel',
    href: '/shop/apparel',
    imageUrl: '/images/apparel/crew-neck.png',
    description: 'Custom T-Shirts, Hoodies, and more.',
  },
  {
    name: 'Drinkware',
    href: '/shop/drinkware',
    imageUrl: '/images/drinkware/ceramic.png',
    description: 'Personalized mugs for every occasion.',
  },
  {
    name: 'Accessories',
    href: '/shop/accessories',
    imageUrl: '/images/accessories/tote.png',
    description: 'Custom hats, tote bags, and more.',
  },
  {
    name: 'Home & Living',
    href: '/shop/home-living',
    imageUrl: '/images/home/pillow.png', // Using the pillow image
    description: 'Custom pillows, blankets, and aprons.',
  },
];

// --- Data Fetching ---
async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://localhost:5001/api/products', {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await res.json();
    return products.slice(0, 4);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// --- Page Component ---
export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <main>
      {/* Hero Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 shadow-2xl lg:grid lg:grid-cols-2 lg:gap-8 backdrop-blur-sm">
            <div className="flex flex-col justify-center p-12 text-center lg:text-left">
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-lg" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Your Design, Our Canvas
              </h1>
              <p className="mt-6 text-xl text-white/90 leading-relaxed">
                Create and order custom apparel, mugs, posters, and more.
              </p>
              <div className="mt-8">
                <Link
                  href="/shop/apparel"
                  className="inline-block rounded-full bg-white px-10 py-4 text-lg font-semibold text-purple-600 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Start Designing
                </Link>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-12 lg:w-[55%] lg:z-20">
              <div className="relative w-full h-full lg:h-[500px] pr-5">
                <img
                  src="/images/hero.png"
                  alt="Custom printed products showcase"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold tracking-tight text-gray-800 mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          Featured Products
        </h2>

        {products.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border-2 border-dashed border-purple-300 bg-white/50 backdrop-blur-sm">
            <p className="text-gray-600">
              No products found. Your backend might be offline or the database is
              empty.
            </p>
          </div>
        )}
      </div>

      {/* "Explore All" Categories Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold tracking-tight text-gray-800 mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          Explore All Categories
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </div>
    </main>
  );
}
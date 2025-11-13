import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import Link from 'next/link';

// --- Category Data (Updated to match new structure) ---
const categories = [
  {
    name: 'Apparel',
    href: '/shop/apparel', // Links to new /shop/ route
    imageUrl: '/images/apparel/crew-neck.png', // Using a real T-shirt image
    description: 'Custom T-Shirts, Hoodies, and more.',
  },
  {
    name: 'Drinkware',
    href: '/shop/drinkware',
    imageUrl: '/images/drinkware/ceramic.png', // Using a real mug image
    description: 'Personalized mugs for every occasion.',
  },
  {
    name: 'Accessories',
    href: '/shop/accessories',
    imageUrl: '/images/accessories/tote.png', // Using a real tote bag image
    description: 'Custom hats, tote bags, and more.',
  },
  // {
  //   name: 'Prints',
  //   href: '/shop/prints',
  //   imageUrl: 'https://i.imgur.com/1n0mPco.png', // Using a real poster image
  //   description: 'High-quality posters and framed prints.',
  // },
];

// --- Data Fetching ---
async function getFeaturedProducts(): Promise<Product[]> {
  try {
    // We'll just fetch all products and take the first 4 as "featured"
    const res = await fetch('http://localhost:5001/api/products', {
      cache: 'no-store', // Always get fresh data
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await res.json();
    return products.slice(0, 4); // Get first 4 products
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Return empty array on error
  }
}

// --- Page Component ---
export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <main>
      {/* Hero Section */}
      <div className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="flex flex-col justify-center p-12 text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Your Design, Our Canvas
              </h1>
              <p className="mt-4 text-xl text-white">
                Create and order custom apparel, mugs, posters, and more.
              </p>
              <div className="mt-8">
                <Link
                  href="/shop/apparel" // Link to the main apparel page
                  className="inline-block rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-indigo-600 shadow-md hover:bg-gray-100"
                >
                  Start Designing
                </Link>
              </div>
            </div>
            <div className="relative h-64 w-full lg:h-full">
              <img
                className="h-full w-full object-cover"
                src="https://placehold.co/800x600/FFFFFF/3B82F6?text=Custom+Prints+Here"
                alt="Custom print examples"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Featured Products
        </h2>

        {products.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-900">
            <p className="text-gray-400">
              No products found. Your backend might be offline or the database is
              empty.
            </p>
          </div>
        )}
      </div>

      {/* "Explore All" Categories Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Explore All Categories
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            // Use spread props to pass data to the card
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </div>
    </main>
  );
}
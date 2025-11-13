import CategoryCard from '@/components/CategoryCard';
import { Product } from '@/types';

// This is the standard, correct interface for props
interface CategoryPageProps {
  params: {
    category: string; // e.g., "t-shirts"
  };
}

// Helper function to format the title
function formatTitle(slug: string): string {
  if (!slug) return 'Products';
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Fetch all products for this MAIN category (e.g., all t-shirts)
async function getProductsByMainCategory(
  mainCategory: string
): Promise<Product[]> {
  try {
    const res = await fetch(
      `http://localhost:5001/api/products/main-category/${mainCategory}`,
      {
        cache: 'no-store', // This prevents caching issues
      }
    );
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// --- THIS IS THE CORRECTION ---
// We receive '{ params }' directly as an argument.
// We do NOT use 'await props'.

// export default async function DynamicCategoryPage({ 
//   params 
// }: { 
//   params: Promise<{ category: string }> 
// }) {
//   const { category } = await params
//   return <div>{category}</div>
// }

export default async function DynamicCategoryPage({
  params
}: {params: Promise<{ category: string }>}) {
  // We can now directly access params.category
  const { category } = await params;

  const products = await getProductsByMainCategory(category);
  const title = formatTitle(category);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">
        {title}
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <CategoryCard
              key={product._id}
              name={product.name}
              description={product.description}
              imageUrl={product.baseImageUrl}
              href={`/shop/${product.mainCategory}/${product.slug}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-900">
          <p className="text-gray-400">
            No products found in this category. Check back soon!
          </p>
        </div>
      )}
    </main>
  );
}
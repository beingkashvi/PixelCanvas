import CategoryCard from '@/components/CategoryCard';
import { Product } from '@/types';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

function formatTitle(slug: string): string {
  if (!slug) return 'Products';
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function getProductsByMainCategory(
  mainCategory: string
): Promise<Product[]> {
  try {
    const res = await fetch(
      `http://localhost:5001/api/products/main-category/${mainCategory}`,
      {
        cache: 'no-store',
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

export default async function DynamicCategoryPage({
  params
}: {params: Promise<{ category: string }>}) {
  const { category } = await params;

  const products = await getProductsByMainCategory(category);
  const title = formatTitle(category);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-5xl font-bold tracking-tight text-gray-800" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
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
        <div className="flex h-40 items-center justify-center rounded-2xl border-2 border-dashed border-purple-300 bg-white/50 backdrop-blur-sm">
          <p className="text-gray-600">
            No products found in this category. Check back soon!
          </p>
        </div>
      )}
    </main>
  );
}
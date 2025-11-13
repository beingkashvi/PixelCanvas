"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types'; // We use the main Product type

// This interface is simple, just gets the product
interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // --- THIS IS THE FIX ---
  // We are now using product.baseImageUrl, which exists
  // The old code was using product.image, which is now undefined
  const fallbackImg = `https://placehold.co/600x600/3B82F6/FFF?text=${encodeURIComponent(
    product.name
  )}`;

  // We initialize the state with the correct image URL
  const [imgSrc, setImgSrc] = useState(product.baseImageUrl || fallbackImg);

  const handleError = () => {
    // If the image fails to load, use the fallback
    setImgSrc(fallbackImg);
  };

  return (
    <Link
      href={`/shop/${product.mainCategory}/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-lg transition-all duration-300 hover:border-blue-500 hover:shadow-blue-500/30"
    >
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imgSrc} // This will now have a valid URL
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          onError={handleError} // This handles broken image links
        />
      </div>

      {/* Content Container */}
      <div className="flex-1 p-4">
        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-400">{product.description}</p>
      </div>

      {/* Price Footer */}
      <div className="rounded-b-lg border-t border-gray-800 bg-gray-800/50 px-4 py-3">
        <p className="text-lg font-semibold text-white">
          From ${product.basePrice.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const fallbackImg = `https://placehold.co/600x600/B794F6/FFF?text=${encodeURIComponent(
    product.name
  )}`;

  const [imgSrc, setImgSrc] = useState(product.baseImageUrl || fallbackImg);

  const handleError = () => {
    setImgSrc(fallbackImg);
  };

  return (
    <Link
      href={`/shop/${product.mainCategory}/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-purple-100"
    >
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          onError={handleError}
        />
      </div>

      {/* Content Container */}
      <div className="flex-1 p-5">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
      </div>

      {/* Price Footer */}
      <div className="rounded-b-2xl bg-gradient-to-r from-purple-50 to-pink-50 px-5 py-4 border-t border-purple-100">
        <p className="text-lg font-bold text-purple-600">
          From ${product.basePrice.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
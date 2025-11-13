"use client";

import Image from 'next/image';
import Link from 'next/link';

// The props now match our new product data structure
interface CategoryCardProps {
  name: string;
  href: string;
  imageUrl: string;
  description: string;
}

const CategoryCard = ({
  name,
  href,
  imageUrl,
  description,
}: CategoryCardProps) => {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-lg transition-all duration-300 hover:border-blue-500 hover:shadow-blue-500/30"
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        {/* Overlay effect */}
        <div className="absolute inset-0 bg-black bg-opacity-30 transition-all duration-300 group-hover:bg-opacity-10" />
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400">
          {name}
        </h3>
        {/* We are now using the description prop */}
        <p className="mt-2 flex-grow text-sm text-gray-400">{description}</p>
        <div className="mt-4">
          <span className="font-medium text-blue-500 group-hover:text-blue-400">
            Shop Now &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
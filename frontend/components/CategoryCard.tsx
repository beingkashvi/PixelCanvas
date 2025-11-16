"use client";

import Image from 'next/image';
import Link from 'next/link';

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
      className="group flex flex-col overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-purple-100"
    >
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-2"
        />
        {/* Overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent transition-all duration-300 group-hover:from-purple-500/10" />
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          {name}
        </h3>
        <p className="mt-3 flex-grow text-sm text-gray-600 leading-relaxed">{description}</p>
        <div className="mt-5 flex items-center">
          <span className="font-semibold text-purple-500 group-hover:text-pink-500 transition-colors">
            Shop Now
          </span>
          <svg 
            className="ml-2 h-5 w-5 text-purple-500 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
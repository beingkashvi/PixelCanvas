import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // 1. This is the new, non-deprecated way to whitelist 'placehold.co'
    // This fixes your first warning.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    // 2. This tells Next.js to allow SVGs.
    // This fixes your "dangerouslyAllowSVG" crash.
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
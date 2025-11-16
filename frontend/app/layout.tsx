import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext'; // NEW: Import CartProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Custom Print Shop',
  description: 'Your one-stop shop for custom prints.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-gray-200`}>
        {/* Wrap in AuthProvider first, then CartProvider */}
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
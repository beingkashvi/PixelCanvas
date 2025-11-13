import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header'; // Import the new Header

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
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* Add the Header to every page */}
        <Header />
        
        {/* Page content will be injected here */}
        <main className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        
        {/* You could add a Footer component here later */}
      </body>
    </html>
  );
}

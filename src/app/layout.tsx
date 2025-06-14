// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EPIC.SUPPLY - Simple, Soft Basics for Kids',
  description: 'Beautifully simple, incredibly soft basics for your child\'s everyday adventures.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <nav className="container mx-auto p-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold tracking-tighter">
              EPIC<span className="text-blue-600">.</span>SUPPLY
            </Link>
            <div className="space-x-4">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Shop
              </Link>
              <Link href="/cart" className="text-gray-600 hover:text-blue-600">
                Cart
              </Link>
              {/* This is our new link to the admin panel */}
              <Link href="/admin/orders" className="text-gray-600 hover:text-blue-600">
                Admin
              </Link>
            </div>
          </nav>
        </header>

        {/* The 'children' here will be the content of our individual pages */}
        <main>{children}</main>

        <footer className="bg-gray-100 mt-12 py-8">
            <div className="container mx-auto text-center text-gray-500">
                &copy; {new Date().getFullYear()} EPIC.SUPPLY. All Rights Reserved.
            </div>
        </footer>
      </body>
    </html>
  );
}

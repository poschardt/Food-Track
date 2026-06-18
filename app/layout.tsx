import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Food Track",
  description: "Track your meals and ingredients",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex gap-6 items-center">
          <Link href="/" className="font-semibold text-lg text-green-700">Food Track</Link>
          <Link href="/ingredients" className="text-sm text-gray-600 hover:text-gray-900">Ingredients</Link>
          <Link href="/recipes" className="text-sm text-gray-600 hover:text-gray-900">Recipes</Link>
        </nav>
        <main className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}

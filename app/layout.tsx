import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Bitcoin } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BitFund",
  description: "Bitcoin crowdfunding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`h-full ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-6 flex justify-between items-center">
              <Link href="/">
                <div className="flex items-center space-x-2">
                  <Bitcoin className="h-8 w-8 text-yellow-500" />
                  <span className="text-2xl font-bold">BitFund</span>
                </div>
              </Link>
              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <Link href="/" className="hover:text-yellow-500 transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/campaigns" className="hover:text-yellow-500 transition-colors">
                      Campaigns
                    </Link>
                  </li>
                  <li>
                    <Link href="/create-campaign" className="hover:text-yellow-500 transition-colors">
                      Create Campaign
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-yellow-500 transition-colors">
                      About
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
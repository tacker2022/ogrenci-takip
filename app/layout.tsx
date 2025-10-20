import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Öğrenci Takip",
  description: "Öğrenci, sınıf ve devamsızlık takibi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b border-black/[.08] dark:border-white/[.145]">
          <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-6">
            <Link href="/" className="font-semibold">Öğrenci Takip</Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/ogrenciler" className="hover:underline">Öğrenciler</Link>
              <Link href="/siniflar" className="hover:underline">Sınıflar</Link>
              <Link href="/devamsizlik" className="hover:underline">Devamsızlık</Link>
              <Link href="/raporlar" className="hover:underline">Raporlar</Link>
            </div>
          </nav>
        </header>
        <div className="max-w-5xl mx-auto px-6">
          {children}
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Trackilio | Collect Places. Plan Trips. Go Explore.',
    template: '%s | Trackilio',
  },
  description:
    'Trackilio is an editorial travel discovery and list-sharing platform. Collect places, map routes, and curate trip guides.',
  openGraph: {
    title: 'Trackilio | Collect Places. Plan Trips. Go Explore.',
    description:
      'Trackilio is an editorial travel discovery and list-sharing platform. Collect places, map routes, and curate trip guides.',
    url: siteUrl,
    siteName: 'Trackilio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trackilio | Collect Places. Plan Trips. Go Explore.',
    description:
      'Trackilio is an editorial travel discovery and list-sharing platform. Collect places, map routes, and curate trip guides.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${newsreader.variable}`}>
      <body className="flex min-h-screen flex-col bg-[#FAF6F0] text-[#2C2A29] font-sans pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}

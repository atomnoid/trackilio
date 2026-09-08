import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Trackilio | Collect Places. Plan Trips. Go Explore.',
    template: '%s | Trackilio',
  },
  description:
    'Discover, create, and share interactive travel lists. Save places, map routes, and collaborate on your next trip with Trackilio.',
  openGraph: {
    title: 'Trackilio | Collect Places. Plan Trips. Go Explore.',
    description:
      'Discover, create, and share interactive travel lists. Save places, map routes, and collaborate on your next trip with Trackilio.',
    url: siteUrl,
    siteName: 'Trackilio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trackilio | Collect Places. Plan Trips. Go Explore.',
    description:
      'Discover, create, and share interactive travel lists. Save places, map routes, and collaborate on your next trip with Trackilio.',
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
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="flex min-h-screen flex-col bg-[#F8F7FF] text-[#0F172A] font-sans pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}

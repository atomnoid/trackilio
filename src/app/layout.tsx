import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MyWanderLists | Discover Places Worth Remembering',
    template: '%s | MyWanderLists',
  },
  description:
    'Create, discover, and collaboratively build user-generated travel lists. Curated spots, hidden gems, and travel bucket lists.',
  openGraph: {
    title: 'MyWanderLists | Discover Places Worth Remembering',
    description:
      'Create, discover, and collaboratively build user-generated travel lists.',
    url: siteUrl,
    siteName: 'MyWanderLists',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyWanderLists | Discover Places Worth Remembering',
    description:
      'Create, discover, and collaboratively build user-generated travel lists.',
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
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream text-charcoal font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

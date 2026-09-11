import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { getSiteUrl } from '@/lib/utils';

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

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Trackilio | Find Places. Save Them. Plan Together.',
    template: '%s | Trackilio',
  },
  description:
    'Trackilio helps you discover authentic cafes, restaurants, hidden gems, and date spots. Save places into lists and collaborate with friends.',
  openGraph: {
    title: 'Trackilio | Find Places. Save Them. Plan Together.',
    description:
      'Trackilio helps you discover authentic cafes, restaurants, hidden gems, and date spots. Save places into lists and collaborate with friends.',
    url: siteUrl,
    siteName: 'Trackilio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trackilio | Find Places. Save Them. Plan Together.',
    description:
      'Trackilio helps you discover authentic cafes, restaurants, hidden gems, and date spots. Save places into lists and collaborate with friends.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${newsreader.variable}`}>
      <body className="flex min-h-screen flex-col bg-[#FAF3E1] text-[#222222] font-sans pb-16 md:pb-0 selection:bg-[#F5E7C6] selection:text-[#222222]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
        {/* Vercel Web Analytics */}
        <Analytics />
        {/* Google Analytics 4 — reads NEXT_PUBLIC_GA_ID, no-ops if unset */}
        <GoogleAnalytics />
      </body>
    </html>
  );
}

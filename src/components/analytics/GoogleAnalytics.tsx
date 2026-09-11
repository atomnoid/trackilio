'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// The GA Measurement ID is intentionally public — it is a client-side identifier
// used only to send anonymous analytics data to Google Analytics 4.
// It is NOT a secret and must be prefixed with NEXT_PUBLIC_ to be available in the browser.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Sends a page_view event to GA4.
 * Called manually on client-side navigations to avoid duplicate events.
 */
function sendPageView(url: string) {
  if (!GA_ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: url,
    send_to: GA_ID,
  });
}

/**
 * GoogleAnalytics — a lightweight client component that:
 * 1. Loads the Google tag (gtag.js) script once via next/script (afterInteractive).
 * 2. Initialises GA4 with the Measurement ID from NEXT_PUBLIC_GA_ID.
 * 3. Tracks client-side navigations by watching usePathname().
 * 4. Does nothing when NEXT_PUBLIC_GA_ID is not set (safe in dev/preview).
 *
 * Place once in the root layout — renders no visible UI.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();

  // Track client-side navigation page views
  useEffect(() => {
    if (!GA_ID) return;
    // The initial page_view is already fired by the gtag('config') call in the
    // inline init script below. We only fire manually on subsequent navigations.
    // To detect "subsequent" we could track a ref, but because the init script
    // sets send_page_view: false we always fire manually — keeping it simple and
    // duplicate-free.
    sendPageView(pathname);
  }, [pathname]);

  // Do not render any scripts if the env var is missing
  if (!GA_ID) return null;

  return (
    <>
      {/* 1. Load the Google tag library — deferred until after hydration */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      {/* 2. Inline init — must run immediately after the library loads.
              send_page_view: false — we control page_view ourselves via useEffect
              to avoid a duplicate on the first render. */}
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              send_page_view: false,
              page_path: window.location.pathname
            });
          `,
        }}
      />
    </>
  );
}

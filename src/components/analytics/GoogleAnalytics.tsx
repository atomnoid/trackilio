'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// The GA Measurement ID is intentionally public — it is a client-side identifier
// used only to send anonymous analytics data to Google Analytics 4.
// It is NOT a secret and must be prefixed with NEXT_PUBLIC_ to be available in the browser.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Sends a page_view event to GA4.
 * Only called after gtag has been confirmed loaded (via onLoad or ref guard).
 */
function sendPageView(url: string) {
  if (!GA_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: url,
    send_to: GA_ID,
  });
}

/**
 * GoogleAnalytics — a lightweight client component that:
 * 1. Loads the Google tag (gtag.js) via next/script with strategy="afterInteractive".
 * 2. Initialises GA4 with NEXT_PUBLIC_GA_ID and send_page_view: false.
 * 3. Fires the initial page_view once gtag is ready (via onLoad on the init script).
 * 4. Tracks every subsequent client-side route change via usePathname().
 * 5. Does nothing when NEXT_PUBLIC_GA_ID is not set (safe in dev / preview).
 *
 * Rendered once in the root layout — produces no visible UI.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  // Tracks whether gtag has finished loading — prevents firing page_view before
  // the script is ready on the initial mount.
  const gtagReady = useRef(false);

  // Track client-side navigation page views (subsequent navigations only).
  // The initial page_view is fired in the Script onLoad callback below.
  useEffect(() => {
    if (!GA_ID || !gtagReady.current) return;
    sendPageView(pathname);
  }, [pathname]);

  // Do not render any scripts when the env var is missing
  if (!GA_ID) return null;

  return (
    <>
      {/* 1. Load the Google tag library — deferred until after hydration */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      {/* 2. Inline init script — runs after the library above is loaded.
              send_page_view: false — we control page_view manually to avoid duplicates.
              onLoad fires the initial page_view and marks gtag as ready. */}
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        onLoad={() => {
          gtagReady.current = true;
          // Fire the initial page_view now that gtag is confirmed ready
          sendPageView(window.location.pathname);
        }}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { send_page_view: false });
          `,
        }}
      />
    </>
  );
}

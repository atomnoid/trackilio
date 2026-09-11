'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { TrackilioBalloonLogo } from '@/components/brand/TrackilioBalloonLogo';

// How long (ms) a navigation must take before the balloon appears.
// Fast navigations (<= this threshold) never show the overlay at all.
const SHOW_DELAY_MS = 350;

/**
 * NavigationLoader — Global hot-air balloon loading overlay.
 *
 * Shows the Trackilio balloon animation during slow page transitions,
 * on every page, on every device.
 *
 * Strategy:
 *  1. Listen for any <a> click that represents an internal navigation.
 *  2. Start a SHOW_DELAY_MS timer. If the new page loads quickly, cancel it — no flash.
 *  3. If the timer fires first, show the full-screen overlay.
 *  4. When usePathname() changes, the new page is ready → dismiss the overlay.
 */
export function NavigationLoader() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false); // drives the fade-out animation
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);

  /** Cleanly dismiss the overlay with a fade-out */
  const dismiss = useCallback(() => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    setFading(true);
    // Remove after CSS transition completes
    setTimeout(() => {
      setVisible(false);
      setFading(false);
    }, 300);
  }, []);

  /** Detect when navigation completes (pathname changed → new page rendered) */
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      dismiss();
    }
  }, [pathname, dismiss]);

  /** Intercept link clicks to detect navigation start */
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore: external links, hash links, mailto, tel, javascript
      if (
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('#') ||
        href.startsWith('mailto') ||
        href.startsWith('tel') ||
        href.startsWith('javascript')
      ) return;

      // Ignore: open in new tab
      if (anchor.getAttribute('target') === '_blank') return;

      // Ignore: same page (no navigation will happen)
      const targetPath = href.split('?')[0].split('#')[0];
      const currentPath = window.location.pathname;
      if (targetPath === currentPath || targetPath === '') return;

      // Cancel any pending show timer
      if (showTimer.current) {
        clearTimeout(showTimer.current);
        showTimer.current = null;
      }
      setFading(false);

      // Only show balloon if navigation takes longer than SHOW_DELAY_MS
      showTimer.current = setTimeout(() => {
        setVisible(true);
      }, SHOW_DELAY_MS);
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
      if (showTimer.current) clearTimeout(showTimer.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Page loading"
      className={`
        fixed inset-0 z-[9999] flex flex-col items-center justify-center
        bg-[#FAF3E1]/90 backdrop-blur-sm
        transition-opacity duration-300 ease-in-out
        ${fading ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Balloon animation */}
      <div className="flex flex-col items-center gap-5 select-none">
        <TrackilioBalloonLogo
          size={120}
          animated={true}
          showClouds={true}
          showSparks={true}
        />

        {/* Dot-pulse loading indicator */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#FA8112]"
              style={{
                animation: `nav-dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>

        <p className="text-sm font-semibold text-[#6B6862] tracking-wide">
          Taking flight…
        </p>
      </div>

      {/* Inline keyframes for the dot bounce */}
      <style>{`
        @keyframes nav-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

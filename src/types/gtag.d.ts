// Type declarations for the Google Analytics global gtag function.
// gtag is injected at runtime by the Google tag script (gtag.js).
// This file is auto-included via tsconfig.json "include" glob.

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gtag: (...args: any[]) => void;
  dataLayer: unknown[];
}

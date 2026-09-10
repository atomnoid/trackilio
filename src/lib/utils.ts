import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export const CANONICAL_SITE_URL = 'https://trackilio.com';

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!envUrl) {
    return CANONICAL_SITE_URL;
  }
  if (process.env.NODE_ENV === 'production' && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
    return CANONICAL_SITE_URL;
  }
  if (envUrl.includes('www.trackilio.com')) {
    return CANONICAL_SITE_URL;
  }
  return envUrl.replace(/\/+$/, '');
}

/**
 * Instagram-Style Username Validation and Utilities
 *
 * Rules:
 * 1. Length: 3 to 30 characters
 * 2. Allowed characters: lowercase letters (a-z), numbers (0-9), periods (.), underscores (_), hyphens (-)
 * 3. Cannot start or end with a period, underscore, or hyphen
 * 4. Cannot contain consecutive periods (e.g. '..')
 * 5. Case-insensitive (always stored and compared in lowercase)
 * 6. Reserved words disallowed (e.g. 'admin', 'blend', 'dashboard', 'settings', etc.)
 */

export const RESERVED_USERNAMES = new Set([
  'about',
  'account',
  'admin',
  'administrator',
  'api',
  'auth',
  'blend',
  'bot',
  'create',
  'dashboard',
  'discover',
  'edit',
  'explore',
  'faq',
  'feed',
  'help',
  'home',
  'join',
  'l',
  'list',
  'lists',
  'login',
  'logout',
  'map',
  'maps',
  'member',
  'members',
  'new',
  'notifications',
  'place',
  'places',
  'privacy',
  'profile',
  'profiles',
  'register',
  'robots',
  'root',
  'save',
  'saved',
  'search',
  'settings',
  'signin',
  'signout',
  'signup',
  'sitemap',
  'support',
  'system',
  'terms',
  'trackilio',
  'trip',
  'trips',
  'u',
  'user',
  'users',
  'wander',
  'welcome',
]);

/**
 * Strips leading '@', trims whitespace, and converts to lowercase.
 */
export function sanitizeUsername(input: string): string {
  if (!input) return '';
  return input.trim().replace(/^@+/, '').toLowerCase();
}

export interface UsernameValidationResult {
  valid: boolean;
  error?: string;
  cleanUsername: string;
}

/**
 * Validates whether a username follows Instagram-style username rules.
 */
export function validateUsernameFormat(rawInput: string): UsernameValidationResult {
  const clean = sanitizeUsername(rawInput);

  if (!clean) {
    return {
      valid: false,
      error: 'Username is required.',
      cleanUsername: '',
    };
  }

  if (clean.length < 3) {
    return {
      valid: false,
      error: 'Username must be at least 3 characters long.',
      cleanUsername: clean,
    };
  }

  if (clean.length > 30) {
    return {
      valid: false,
      error: 'Username cannot exceed 30 characters.',
      cleanUsername: clean,
    };
  }

  // Check valid characters: only a-z, 0-9, ., _, -
  if (!/^[a-z0-9._-]+$/.test(clean)) {
    return {
      valid: false,
      error: 'Username can only contain letters, numbers, periods (.), underscores (_), and hyphens (-).',
      cleanUsername: clean,
    };
  }

  // Cannot start or end with a special character (., _, -)
  if (/^[._-]/.test(clean)) {
    return {
      valid: false,
      error: 'Username cannot start with a period, underscore, or hyphen.',
      cleanUsername: clean,
    };
  }

  if (/[._-]$/.test(clean)) {
    return {
      valid: false,
      error: 'Username cannot end with a period, underscore, or hyphen.',
      cleanUsername: clean,
    };
  }

  // Cannot contain consecutive periods (..)
  if (/\.\./.test(clean)) {
    return {
      valid: false,
      error: 'Username cannot contain consecutive periods.',
      cleanUsername: clean,
    };
  }

  // Check reserved keywords
  if (RESERVED_USERNAMES.has(clean)) {
    return {
      valid: false,
      error: 'This username is reserved by Trackilio.',
      cleanUsername: clean,
    };
  }

  return {
    valid: true,
    cleanUsername: clean,
  };
}

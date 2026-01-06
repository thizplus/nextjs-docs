/**
 * Locale Storage Utility
 * Stores and retrieves the current locale for API requests
 */

const LOCALE_KEY = 'app-locale';
const DEFAULT_LOCALE = 'th';

/**
 * Get the current locale from storage
 */
export function getStoredLocale(): string {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  try {
    return localStorage.getItem(LOCALE_KEY) || DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

/**
 * Set the current locale in storage
 */
export function setStoredLocale(locale: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get locale code for API (convert to language code if needed)
 * e.g., 'th' -> 'th', 'en' -> 'en'
 *
 * Priority:
 * 1. URL path locale (e.g., /en/dashboard -> 'en')
 * 2. localStorage
 * 3. Default 'th'
 */
export function getApiLocale(): string {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  // First, try to get locale from URL path
  const pathname = window.location.pathname;
  const pathLocale = pathname.split('/')[1]; // Get first segment after /

  const supportedLocales = ['th', 'en'];
  if (supportedLocales.includes(pathLocale)) {
    // Update localStorage to keep in sync
    setStoredLocale(pathLocale);
    return pathLocale;
  }

  // Fallback to localStorage
  const locale = getStoredLocale();
  const localeMap: Record<string, string> = {
    th: 'th',
    en: 'en',
  };
  return localeMap[locale] || 'th';
}

import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Hide default locale from URL (th won't show in URL)
});

// Export navigation utilities
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

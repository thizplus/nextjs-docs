import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Static files (images, fonts, etc.)
  // - Next.js internals
  matcher: [
    // Match all pathnames except for:
    // - API routes (/api/...)
    // - Static files (/_next/static/..., /_next/image/..., /favicon.ico, etc.)
    // - Public files (/images/..., /icons/..., etc.)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};

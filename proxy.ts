import createMiddleware from 'next-intl/middleware';
import { auth } from '@/auth';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'fr', 'ar'],

  // Used when no locale matches
  defaultLocale: 'en'
});

export default auth((req) => {
  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|ar|en)/:path*']
};
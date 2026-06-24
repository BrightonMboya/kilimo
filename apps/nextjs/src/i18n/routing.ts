import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'ar', 'fr', 'it'],
    defaultLocale: 'en',
    localePrefix: 'always' // <-- change this
//   localePrefix: 'as-needed' // no prefix for default locale
});
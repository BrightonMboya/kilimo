'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import en from '~/locales/en.json';
import fr from '~/locales/fr.json';
import ar from '~/locales/fr.json';


type Locale = 'en' | 'fr' | 'ar';

// messages are nested objects (not flat string maps), so allow any-shaped records
const messages: Record<Locale, Record<string, any>> = {
  en,
  fr,
  ar,
};

const LanguageContext = createContext({
  locale: 'en' as Locale,
  setLocale: (l: Locale) => {},
  t: (k: string) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => (typeof window !== 'undefined' && (localStorage.getItem('lang') as Locale)) || 'en');

  useEffect(() => {
    localStorage.setItem('lang', locale);
  }, [locale]);

  const lookup = (obj: Record<string, any> | undefined, key: string) => {
    if (!obj) return undefined;
    const parts = key.split('.');
    let cur: any = obj;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
      else return undefined;
    }
    return cur;
  };

  const t = (key: string) => {
    const v = lookup(messages[locale], key) ?? lookup(messages['en'], key);
    return typeof v === 'string' ? v : key;
  };

  return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);

import { NextIntlClientProvider } from 'next-intl';
import type { Metadata } from 'next';
import SmoothScrollProvider from '~/components/landingPage/providers/SmoothScrollProvider';
import '../globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

type Props = Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>;

export const metadata: Metadata = {
  title: 'JANI',
};

const supported = ['en', 'fr', 'ar'] as const;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!supported.includes(locale as any)) {
    return <div>Not Found</div>;
  }

  const messages = await import(`../../../locales/${locale}.json`).then((m) => m.default || m);

  return (
    <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`${locale === 'ar' ? 'font-noto' : 'font-oswald'} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
      </div>
    </div>
  );
}

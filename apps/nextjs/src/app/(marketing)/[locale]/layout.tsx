import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import SmoothScrollProvider from "~/components/landingPage/providers/SmoothScrollProvider";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { baseUrl } from "../../sitemap";

const supported = ["en", "fr", "ar"] as const;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: "JANI AI", template: "%s | JANI AI" },
  description: "Jani AI allows you to track food and other resources across the supply chain, letting you provide transparency and trust to your clients.",
  openGraph: {
    title: "JANI AI",
    description: "A food traceability software",
    url: baseUrl,
    siteName: "Jani AI allows you to track food and other resources across the supply chain, letting you provide transparency and trust to your clients.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!supported.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      className={GeistSans.className}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${isArabic ? "font-noto" : "font-oswald"} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

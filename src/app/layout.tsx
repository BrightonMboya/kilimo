import "~/styles/globals.css";
import { headers } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { baseUrl } from "./sitemap";
import { TooltipProvider } from "~/components/ui";
import { Toaster } from "sonner";
import { Toaster as ShadToaster } from "~/components/ui";
import ModalProvider from "~/components/auth/workspaces/WorskpaceModalProvider";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Jani AI",
    template: "%s | Jani AI",
  },
  description:
    "Jani AI allows you to track food and other resources across the supply chain, letting you provide transparency and trust to your clients.",
  openGraph: {
    title: "Jani AI",
    description: "A food traceability software",
    url: baseUrl,
    siteName:
      "Jani AI allows you to track food and other resources across the supply chain, letting you provide transparency and trust to your clients.",
    locale: "en_US",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.className}`}>
      <body className={`${GeistSans.className} font-sans`}>
        {/* <Toaster closeButton className="pointer-events-auto" />  */}
        <Toaster />
        <ShadToaster />
        <TRPCReactProvider headers={headers()}>
          <ModalProvider>{children}</ModalProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

import "~/styles/globals.css";
import { headers } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import ModalProvider from "~/components/auth/workspaces/WorskpaceModalProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${GeistSans.className} font-sans antialiased`}>
        <Toaster />
        <Analytics />
        <SpeedInsights />
        <TRPCReactProvider headers={headers()}>
          <ModalProvider>{children}</ModalProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
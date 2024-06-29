import "~/styles/globals.css";
import { headers } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { baseUrl } from "./sitemap";
import { createClient } from "~/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Jani AI | A food traceability software",
    template: "%s | Jani AI",
  },
  description:
    "Jani AI allows you to track food and other resources across the supply chain, letting you provide transparency and trust to your clients.",
  openGraph: {
    title: "Jani AI | Track food from farm to fork",
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

export default async function RootLayout({
  children,
  params: { accountSlug },
}: {
  children: React.ReactNode;
  params: { accountSlug: string };
}) {
  const supabaseClient = createClient();

  const { data: teamAccount, error } = await supabaseClient.rpc(
    "get_account_by_slug",
    {
      slug: accountSlug,
    },
  );

  // if (!teamAccount) {
  //   redirect("/");
  // }
  console.log(teamAccount, ">>>>>>>>");
  return (
    <html lang="en" className={`${GeistSans.className} font-sans`}>
      <body>
        <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}

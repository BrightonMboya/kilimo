import type { MetadataRoute } from "next";

export const baseUrl = "https://jani-ai.com";

import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();
  let domain = headersList.get("host") as string;

  if (domain === "localhost:3000" || domain.endsWith(".vercel.app")) {
    // for local development and preview URLs
    domain = "localhost:3000";
  }

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
  ];
}

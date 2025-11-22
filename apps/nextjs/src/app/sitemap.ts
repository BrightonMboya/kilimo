// import type { MetadataRoute } from "next";

// export const baseUrl = "https://jani-ai.com";

// import { headers } from "next/headers";

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const headersList = headers();
//   let domain = headersList.get("host") as string;

//   if (domain === "localhost:3000" || domain.endsWith(".vercel.app")) {
//     // for local development and preview URLs
//     domain = "localhost:3000";
//   }

//   return [
//     {
//       url: `https://${domain}`,
//       lastModified: new Date(),
//     },
//   ];
// }

import { MetadataRoute } from 'next'
import { allPosts } from 'content-collections'

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://jani-ai.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Define your static routes here
  const staticRoutes = [
    "/",
    // "/about",
    // "/contact",
    "/privacy",
    "/terms",
    "/blog",
    "/features/farmerManagement"
  ]

  const staticEntries = staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }))

  // Generate entries for blog posts using content collections
  const blogEntries = allPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticEntries, ...blogEntries]
}
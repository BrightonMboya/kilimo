/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// await import("./src/env.js");

import { withSentryConfig } from "@sentry/nextjs";
import NextMDX from "@next/mdx";
import { withContentCollections } from "@content-collections/next";
import createNextIntlPlugin from "next-intl/plugin";

const withMDX = NextMDX();

/** @type {import("next").NextConfig} */
const nextConfig = withMDX({
  reactStrictMode: true,
  transpilePackages: ["@kilimo/api", "@kilimo/db"],
  pageExtensions: ["js", "jsx", "mdx", "md", "ts", "tsx"],
  // hack to resolve the react email package on edge
  experimental: {
    serverComponentsExternalPackages: [
      "@react-email/components",
      "@react-email/render",
      "@react-email/tailwind",
    ],
  },

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  // who gives a damn about eslint while you can just ship stuff
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "api.dicebear.com" },
      { hostname: "lh3.googleusercontent.com" },
    ],
  },
});

const sentryConfig = {
  org: "jani-x5",
  project: "jani-ai",
  silent: !process.env.CI,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

const withNextIntl = createNextIntlPlugin();

export default withContentCollections(
  withSentryConfig(withNextIntl(nextConfig), sentryConfig),
);
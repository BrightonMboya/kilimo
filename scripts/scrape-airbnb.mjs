#!/usr/bin/env node

/**
 * Scrape a public Airbnb listing page for images, description, and location.
 *
 * Usage:
 *   node scripts/scrape-airbnb.mjs <airbnb-url>
 */

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.airbnb.com/",
};

function usageAndExit() {
  console.error("Usage: node scripts/scrape-airbnb.mjs <airbnb-listing-url>");
  process.exit(1);
}

function extractMeta(html, attr, value) {
  const pattern = new RegExp(
    `<meta[^>]*${attr}=["']${escapeRegExp(value)}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    "i",
  );
  const altPattern = new RegExp(
    `<meta[^>]*content=["']([^"']+)["'][^>]*${attr}=["']${escapeRegExp(value)}["'][^>]*>`,
    "i",
  );

  const first = html.match(pattern);
  if (first?.[1]) return decodeHtmlEntities(first[1]);

  const second = html.match(altPattern);
  if (second?.[1]) return decodeHtmlEntities(second[1]);

  return null;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHtmlEntities(input) {
  if (!input) return input;
  return input
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = re.exec(html)) !== null) {
    const raw = match[1]?.trim();
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) blocks.push(item);
      } else {
        blocks.push(parsed);
      }
    } catch {
      // Ignore malformed JSON-LD blobs.
    }
  }

  return blocks;
}

function asArray(v) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function uniqueNonEmpty(values) {
  const out = [];
  const seen = new Set();

  for (const raw of values) {
    const val = typeof raw === "string" ? raw.trim() : "";
    if (!val) continue;
    if (seen.has(val)) continue;
    seen.add(val);
    out.push(val);
  }

  return out;
}

function normalizeImageUrl(url) {
  const decoded = decodeHtmlEntities(url.trim());
  const withoutQuery = decoded.split("?")[0];
  return withoutQuery;
}

function uniqueImages(values) {
  const out = [];
  const seen = new Set();

  for (const raw of values) {
    if (typeof raw !== "string") continue;
    const normalized = normalizeImageUrl(raw);
    if (!normalized) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }

  return out;
}

function parseLocation(vacationRental) {
  const addr = vacationRental?.address ?? {};
  return {
    locality: addr.addressLocality ?? null,
    region: addr.addressRegion ?? null,
    country: addr.addressCountry ?? null,
    latitude:
      typeof vacationRental?.latitude === "number"
        ? vacationRental.latitude
        : vacationRental?.latitude
          ? Number(vacationRental.latitude)
          : null,
    longitude:
      typeof vacationRental?.longitude === "number"
        ? vacationRental.longitude
        : vacationRental?.longitude
          ? Number(vacationRental.longitude)
          : null,
  };
}

function extractListingId(url) {
  const m = url.match(/\/rooms\/(\d+)/);
  return m?.[1] ?? null;
}

function extractListingImagesFromHtml(html, listingId) {
  const normalizedHtml = html.replace(/\\\//g, "/");
  const escapedListingId = listingId ? escapeRegExp(listingId) : null;
  const sourcePattern = escapedListingId
    ? new RegExp(
        `https://a0\\.muscache\\.com/im/pictures/hosting/Hosting-${escapedListingId}/original/[^\"'\\s<)]+`,
        "g",
      )
    : /https:\/\/a0\.muscache\.com\/im\/pictures\/hosting\/Hosting-[^"'\\s<)]+/g;

  return uniqueNonEmpty(normalizedHtml.match(sourcePattern) ?? []);
}

async function main() {
  const url = process.argv[2]?.trim();
  if (!url) usageAndExit();

  if (!/^https?:\/\//i.test(url) || !/airbnb\./i.test(url)) {
    console.error("Please provide a valid Airbnb URL.");
    process.exit(1);
  }

  const response = await fetch(url, { headers: DEFAULT_HEADERS, redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Failed to fetch page (${response.status} ${response.statusText})`);
  }

  const html = await response.text();
  const jsonLdBlocks = extractJsonLdBlocks(html);
  const listingId = extractListingId(url);

  const vacationRental = jsonLdBlocks.find((b) => {
    const types = asArray(b?.["@type"]);
    return types.some((t) => String(t).toLowerCase() === "vacationrental");
  });

  const product = jsonLdBlocks.find((b) => {
    const types = asArray(b?.["@type"]);
    return types.some((t) => String(t).toLowerCase() === "product");
  });

  const images = uniqueImages([
    ...asArray(vacationRental?.image),
    ...asArray(product?.image),
    ...extractListingImagesFromHtml(html, listingId),
  ]);

  const description =
    vacationRental?.description ??
    product?.description ??
    extractMeta(html, "name", "description") ??
    null;

  const location = parseLocation(vacationRental);
  if (!location.locality) {
    location.locality = extractMeta(html, "property", "og:locality") ?? null;
  }

  const result = {
    scrapedAt: new Date().toISOString(),
    sourceUrl: url,
    listingId,
    name: vacationRental?.name ?? product?.name ?? extractMeta(html, "property", "og:title") ?? null,
    description,
    location,
    images,
    imageCount: images.length,
  };

  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(`Error: ${err?.message ?? String(err)}`);
  process.exit(1);
});

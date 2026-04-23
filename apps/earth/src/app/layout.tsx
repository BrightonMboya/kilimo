import type { Metadata } from "next";
import "~/styles/globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

export const metadata: Metadata = {
  title: "JANI Earth — Deforestation risk for farm coordinates",
  description:
    "GeoAI intelligence for farm-level land use, forest monitoring, and EUDR-aligned deforestation risk in Africa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map, Marker } from "maplibre-gl";

const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster" as const,
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster" as const, source: "osm" }],
};

type Point = { lat: number; lng: number };

export function MapView({
  point,
  onPick,
}: {
  point: Point | null;
  onPick: (p: Point) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  // Init map once
  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: OSM_STYLE as maplibregl.StyleSpecification,
      center: [37.9, 0.0], // Kenya-ish default
      zoom: 4,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.on("click", (e) => {
      onPickRef.current({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync marker + viewport with external point
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!point) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }
    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker({ color: "#2e7d32" })
        .setLngLat([point.lng, point.lat])
        .addTo(map);
    } else {
      markerRef.current.setLngLat([point.lng, point.lat]);
    }
    map.flyTo({
      center: [point.lng, point.lat],
      zoom: Math.max(map.getZoom(), 11),
      duration: 800,
    });
  }, [point]);

  return <div ref={ref} className="h-full w-full" />;
}

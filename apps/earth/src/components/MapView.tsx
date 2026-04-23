"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map, Marker } from "maplibre-gl";

const SATELLITE_STYLE = {
  version: 8,
  sources: {
    satellite: {
      type: "raster" as const,
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      maxzoom: 19,
      attribution:
        "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    },
  },
  layers: [
    { id: "satellite", type: "raster" as const, source: "satellite" },
  ],
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
      style: SATELLITE_STYLE as maplibregl.StyleSpecification,
      center: [37.9, 0.0], // Kenya-ish default
      zoom: 4,
      maxZoom: 20,
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
      markerRef.current = new maplibregl.Marker({ color: "#ef4444" })
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

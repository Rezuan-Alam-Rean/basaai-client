"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const markerIcon2x = new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString();
const markerIcon = new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString();
const markerShadow = new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString();

// Ensure default marker icons render correctly in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(delete (L.Icon.Default.prototype as any)._getIconUrl);
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export interface LocationValue {
  lat: number;
  lng: number;
}

export interface LocationPickerProps {
  value: LocationValue | null;
  onChange: (value: LocationValue) => void;
  className?: string;
  heightClassName?: string;
  placeholder?: string;
}

const defaultCenter: LocationValue = { lat: 23.8103, lng: 90.4125 };

function MapFocus({ center }: { center: LocationValue }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
  }, [center.lat, center.lng, map]);
  return null;
}

function MapClickHandler({ onChange }: { onChange: (value: LocationValue) => void }) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export function LocationPicker({
  value,
  onChange,
  className,
  heightClassName = "h-[320px]",
  placeholder = "Search area or landmark",
}: LocationPickerProps) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const center = value ?? defaultCenter;

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=bd&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = (await res.json()) as Array<{ lat: string; lon: string }>;
      if (data.length > 0) {
        onChange({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      }
    } finally {
      setSearching(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-[180px]"
        />
        <Button type="button" variant="outline" size="sm" onClick={handleSearch} disabled={searching}>
          {searching ? "Searching..." : "Search"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleUseMyLocation}>
          Use my location
        </Button>
      </div>
      <div className={`w-full rounded-lg overflow-hidden border border-border ${heightClassName}`}>
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFocus center={center} />
          <MapClickHandler onChange={onChange} />
          {value && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
      </div>
      {value && (
        <p className="text-xs text-muted-foreground mt-2">
          Selected: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}

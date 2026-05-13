"use client";

import { useEffect, useMemo, useState } from "react";
import { Circle, CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Plus, Minus, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetListingQuery, useGetNearbyListingsQuery } from "../redux/features/listing/listingApi";

const markerIcon2x = new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString();
const markerIcon = new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString();
const markerShadow = new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(delete (L.Icon.Default.prototype as any)._getIconUrl);
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";

const radiusOptions = [
  { label: "500m", value: 0.5 },
  { label: "1km", value: 1 },
  { label: "2km", value: 2 },
  { label: "5km", value: 5 },
];

type MapCenter = { lat: number; lng: number };
const defaultCenter: MapCenter = { lat: 23.8103, lng: 90.4125 };

type Landmark = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category?: string;
  distanceMeters?: number;
};

function MapFocus({ center }: { center: MapCenter }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
  }, [center.lat, center.lng, map]);
  return null;
}

function MapZoomControls() {
  const map = useMap();
  return (
    <div className="absolute top-4 right-4 z-[401] flex flex-col gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="w-8 h-8 p-0 bg-card border border-border"
        onClick={() => map.zoomIn()}
      >
        <Plus className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-8 h-8 p-0 bg-card border border-border"
        onClick={() => map.zoomOut()}
      >
        <Minus className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function MapViewPage() {
  const params = useSearchParams();
  const listingId = params.get("listingId");
  const [center, setCenter] = useState<MapCenter>(defaultCenter);
  const [activeRadius, setActiveRadius] = useState(radiusOptions[2]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);

  const { data: listingData } = useGetListingQuery(listingId || "", { skip: !listingId });
  const listingFromQuery = listingData?.listing;

  useEffect(() => {
    if (listingFromQuery?.latitude != null && listingFromQuery?.longitude != null) {
      setCenter({ lat: listingFromQuery.latitude, lng: listingFromQuery.longitude });
      setActiveListingId(listingFromQuery.id);
    }
  }, [listingFromQuery]);

  const { data: nearbyData, isLoading: loadingNearby } = useGetNearbyListingsQuery(
    { lat: center.lat, lng: center.lng, radiusKm: activeRadius.value },
    { skip: !center }
  );

  const listings = (nearbyData?.listings || []).filter((l: any) => l.latitude != null && l.longitude != null);

  useEffect(() => {
    let cancelled = false;
    const fetchLandmarks = async () => {
      const radiusMeters = Math.round(activeRadius.value * 1000);
      const url = `${apiBase}/map/landmarks?lat=${center.lat}&lng=${center.lng}&radius=${radiusMeters}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!cancelled) {
        setLandmarks(data?.landmarks || []);
      }
    };
    fetchLandmarks().catch(() => setLandmarks([]));
    return () => { cancelled = true; };
  }, [center.lat, center.lng, activeRadius.value]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=bd&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = (await res.json()) as Array<{ lat: string; lon: string }>;
      if (data.length > 0) {
        setCenter({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        setActiveListingId(null);
      }
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] relative">
      <button
        className="lg:hidden absolute top-3 left-3 z-[402] bg-card border border-border rounded-md px-3 py-2 text-xs"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "Hide List" : "Show List"}
      </button>

      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 absolute lg:relative z-[401] w-72 lg:w-80 h-full bg-background border-r border-border flex flex-col transition-transform`}>
        <div className="p-4 border-b border-border space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search area or landmark..."
              className="pl-9 bg-muted border-border text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {radiusOptions.map((r) => (
              <button
                key={r.label}
                onClick={() => setActiveRadius(r)}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${
                  activeRadius.value === r.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {loadingNearby ? "Loading listings..." : `${listings.length} listings found nearby`}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {listings.map((l: any) => (
            <button
              key={l.id}
              onClick={() => {
                setCenter({ lat: l.latitude, lng: l.longitude });
                setActiveListingId(l.id);
                setSidebarOpen(false);
              }}
              className={`w-full text-left p-3 border-b border-border/50 hover:bg-accent/50 transition-colors ${
                activeListingId === l.id ? "bg-accent" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Badge variant="secondary" className="text-[10px]">{l.propertyType || "Listing"}</Badge>
                <span className="text-sm font-bold">৳{l.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                <MapPin className="w-3 h-3" />
                {l.location}, {l.city || "Dhaka"}
              </div>
              <div className="flex gap-1 flex-wrap">
                {(l.amenities || []).slice(0, 3).map((f: string) => (
                  <Badge key={f} variant="outline" className="text-[10px] px-1.5 py-0">{f}</Badge>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative bg-muted/30 overflow-hidden">
        <MapContainer center={[center.lat, center.lng]} zoom={13} className="h-full w-full" zoomControl={false}>
          {mapType === "map" ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              attribution='Tiles &copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          <MapFocus center={center} />
          <Circle
            center={[center.lat, center.lng]}
            radius={activeRadius.value * 1000}
            pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.08 }}
          />

          {listings.map((l: any) => (
            <Marker
              key={l.id}
              position={[l.latitude, l.longitude]}
              eventHandlers={{
                click: () => setActiveListingId(l.id),
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="text-xs font-semibold">{l.title}</p>
                  <p className="text-xs text-muted-foreground">{l.location}, {l.city || "Dhaka"}</p>
                  <p className="text-sm font-bold">৳{l.price.toLocaleString()}/mo</p>
                  <Link href={`/listing/${l.id}`} className="text-xs text-primary underline">
                    View details
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}

          {landmarks.map((lm) => (
            <CircleMarker
              key={lm.id}
              center={[lm.lat, lm.lng]}
              radius={5}
              pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 0.6 }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="text-xs font-semibold">{lm.name}</p>
                  {lm.category && <p className="text-[10px] text-muted-foreground">{lm.category}</p>}
                  {lm.distanceMeters != null && (
                    <p className="text-[10px] text-muted-foreground">{(lm.distanceMeters / 1000).toFixed(2)} km away</p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}

          <MapZoomControls />
        </MapContainer>

        <div className="absolute bottom-4 right-4 flex gap-1 z-[401]">
          <button
            className={`px-3 py-1.5 text-xs rounded-l-md border border-border ${
              mapType === "map" ? "bg-card text-foreground" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setMapType("map")}
          >
            Map
          </button>
          <button
            className={`px-3 py-1.5 text-xs rounded-r-md border border-border ${
              mapType === "satellite" ? "bg-card text-foreground" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setMapType("satellite")}
          >
            Satellite
          </button>
        </div>
      </div>
    </div>
  );
}
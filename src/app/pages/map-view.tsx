"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Circle, CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ChevronLeft, ChevronRight, MapPin, Plus, Minus, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetListingQuery, useGetListingsQuery, useGetNearbyListingsQuery } from "../redux/features/listing/listingApi";
import { toast } from "sonner";

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

function createMapPinIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `
      <div style="position: relative; width: 30px; height: 42px;">
        <svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C6.72 0 0 6.72 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.72 23.28 0 15 0Z" fill="${color}"/>
          <circle cx="15" cy="15" r="5.5" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -38],
  });
}

const mainLocationIcon = createMapPinIcon("#16a34a");
const nearbyLocationIcon = createMapPinIcon("#3b82f6");

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";

const radiusOptions = [
  { label: "500m", value: 0.5 },
  { label: "1km", value: 1 },
  { label: "2km", value: 2 },
  { label: "5km", value: 5 },
];
const allListingsPageSize = 8;

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

function ListingPopupContent({ listing }: { listing: any }) {
  return (
    <div className="w-52 space-y-2">
      <div>
        <p className="text-xs font-semibold leading-snug">{listing.title}</p>
        <p className="text-[11px] text-muted-foreground">{listing.location}, {listing.city || "Dhaka"}</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary" className="text-[10px]">{listing.propertyType || "Listing"}</Badge>
        <p className="text-sm font-bold">৳{listing.price.toLocaleString()}/mo</p>
      </div>
      {Array.isArray(listing.amenities) && listing.amenities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {listing.amenities.slice(0, 3).map((item: string) => (
            <Badge key={item} variant="outline" className="text-[10px] px-1.5 py-0">
              {item}
            </Badge>
          ))}
        </div>
      )}
      <Link href={`/listing/${listing.id}`} className="inline-flex text-xs text-primary underline">
        View full details
      </Link>
    </div>
  );
}

function ListingMarker({
  listing,
  active,
  onActivate,
}: {
  listing: any;
  active: boolean;
  onActivate: () => void;
}) {
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (active) {
      markerRef.current?.openPopup();
    }
  }, [active]);

  return (
    <Marker
      ref={markerRef}
      position={[listing.latitude, listing.longitude]}
      icon={active ? mainLocationIcon : nearbyLocationIcon}
      eventHandlers={{
        click: onActivate,
      }}
    >
      <Popup>
        <ListingPopupContent listing={listing} />
      </Popup>
    </Marker>
  );
}

export function MapViewPage() {
  const params = useSearchParams();
  const listingId = params.get("listingId");
  const [center, setCenter] = useState<MapCenter>(defaultCenter);
  const [activeRadius, setActiveRadius] = useState(radiusOptions[2]);
  const [showAllListings, setShowAllListings] = useState(true);
  const [allListingsPage, setAllListingsPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const [query, setQuery] = useState("");
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);

  const { data: listingData } = useGetListingQuery(listingId || "", { skip: !listingId });
  const listingFromQuery = listingData?.listing;

  useEffect(() => {
    if (listingFromQuery?.latitude != null && listingFromQuery?.longitude != null) {
      setCenter({ lat: listingFromQuery.latitude, lng: listingFromQuery.longitude });
      setActiveListingId(listingFromQuery.id);
    } else if (listingFromQuery && listingId) {
      setActiveListingId(listingFromQuery.id);
      toast.warning("This listing is not located on the map yet.");
    }
  }, [listingFromQuery, listingId]);

  const { data: nearbyData, isLoading: loadingNearby } = useGetNearbyListingsQuery(
    { lat: center.lat, lng: center.lng, radiusKm: activeRadius.value },
    { skip: !center || showAllListings }
  );
  const { data: allListingsData, isLoading: loadingAllListings } = useGetListingsQuery(
    { page: allListingsPage, limit: allListingsPageSize, sortBy: "newest" },
    { skip: !showAllListings }
  );

  const rawListings = showAllListings ? allListingsData?.listings || [] : nearbyData?.listings || [];
  const listings = rawListings || [];
  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return listings;

    return listings.filter((listing: any) => {
      const searchableText = [
        listing.title,
        listing.location,
        listing.city,
        listing.address,
        listing.propertyType,
        ...(Array.isArray(listing.amenities) ? listing.amenities : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [listings, query]);
  const mappableListings = listings.filter((l: any) => l.latitude != null && l.longitude != null);
  const displayedMappableListings = useMemo(() => {
    if (listingFromQuery?.latitude == null || listingFromQuery?.longitude == null) {
      return mappableListings;
    }

    const exists = mappableListings.some((listing: any) => listing.id === listingFromQuery.id);
    return exists ? mappableListings : [listingFromQuery, ...mappableListings];
  }, [listingFromQuery, mappableListings]);
  const allListingsPagination = allListingsData?.pagination || {
    total: 0,
    page: allListingsPage,
    limit: allListingsPageSize,
    totalPages: 0,
  };
  const loadingListings = showAllListings ? loadingAllListings : loadingNearby;

  useEffect(() => {
    let cancelled = false;
    const fetchLandmarks = async () => {
      if (showAllListings) {
        setLandmarks([]);
        return;
      }
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
  }, [center.lat, center.lng, activeRadius.value, showAllListings]);

  const handleSearch = async () => {
    setActiveListingId(null);
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
            <button
              onClick={() => {
                setShowAllListings(true);
                setAllListingsPage(1);
              }}
              className={`px-3 py-1 rounded-md text-xs transition-colors ${
                showAllListings ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              All
            </button>
            {radiusOptions.map((r) => (
              <button
                key={r.label}
                onClick={() => {
                  setShowAllListings(false);
                  setActiveRadius(r);
                }}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${
                  !showAllListings && activeRadius.value === r.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {loadingListings
              ? "Loading listings..."
              : showAllListings
                ? query.trim()
                  ? `${filteredListings.length} of ${allListingsPagination.total || 0} available listings`
                  : `${allListingsPagination.total || 0} available listings`
                : query.trim()
                  ? `${filteredListings.length} of ${listings.length} listings shown nearby`
                  : `${listings.length} listings found nearby`}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredListings.map((l: any) => (
            <button
              key={l.id}
              onClick={() => {
                if (l.latitude != null && l.longitude != null) {
                  setCenter({ lat: l.latitude, lng: l.longitude });
                  setActiveListingId(l.id);
                  setSidebarOpen(false);
                } else {
                  setActiveListingId(l.id);
                  toast.warning("This listing is not located on the map yet.");
                }
              }}
              className={`w-full text-left p-3 border-b border-border/50 hover:bg-accent/50 transition-colors ${
                activeListingId === l.id ? "bg-accent" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Badge variant="secondary" className="text-[10px]">{l.propertyType || "Listing"}</Badge>
                <span className="text-sm font-bold">৳{l.price.toLocaleString()}</span>
              </div>
              <p className="text-sm font-semibold leading-snug line-clamp-2 mb-1">
                {l.title}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                <MapPin className="w-3 h-3" />
                {l.location}, {l.city || "Dhaka"}
              </div>
              {(l.latitude == null || l.longitude == null) && (
                <div className="mb-1.5">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500/40 text-amber-700 dark:text-amber-300">
                    Not located on map
                  </Badge>
                </div>
              )}
              <div className="flex gap-1 flex-wrap">
                {(l.amenities || []).slice(0, 3).map((f: string) => (
                  <Badge key={f} variant="outline" className="text-[10px] px-1.5 py-0">{f}</Badge>
                ))}
              </div>
            </button>
          ))}
          {!loadingListings && filteredListings.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No listings match this search.
            </div>
          )}
        </div>
        {showAllListings && allListingsPagination.totalPages > 1 && (
          <div className="border-t border-border p-3 flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              disabled={allListingsPage <= 1 || loadingAllListings}
              onClick={() => setAllListingsPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {allListingsPagination.page} of {allListingsPagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              disabled={allListingsPage >= allListingsPagination.totalPages || loadingAllListings}
              onClick={() => setAllListingsPage((page) => Math.min(allListingsPagination.totalPages, page + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
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
          {!showAllListings && (
            <Circle
              center={[center.lat, center.lng]}
              radius={activeRadius.value * 1000}
              pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 0.08 }}
            />
          )}

          {!showAllListings && !activeListingId && (
            <Marker position={[center.lat, center.lng]} icon={mainLocationIcon}>
              <Popup>
                <p className="text-xs font-semibold">Main location</p>
              </Popup>
            </Marker>
          )}

          {displayedMappableListings.map((l: any) => (
            <ListingMarker
              key={l.id}
              listing={l}
              active={activeListingId === l.id}
              onActivate={() => setActiveListingId(l.id)}
            />
          ))}

          {landmarks.map((lm) => (
            <CircleMarker
              key={lm.id}
              center={[lm.lat, lm.lng]}
              radius={5}
              pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.6 }}
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

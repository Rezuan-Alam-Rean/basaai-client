import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export interface ListingData {
  id: string;
  title: string;
  type: "Bachelor Seat" | "Single Room" | "Family Flat" | "Sublet";
  location: string;
  price: number;
  facilities: string[];
  aiMatch?: number;
  imageUrl?: string;
}

export function ListingCard({ listing, compact }: { listing: ListingData; compact?: boolean }) {
  return (
    <div className="group rounded-lg border border-border bg-card shadow-sm hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
        {listing.imageUrl ? (
          <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
            No Image
          </div>
        )}
        <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs">
          {listing.type}
        </Badge>
      </div>
      <div className={`flex flex-col flex-1 ${compact ? "p-3" : "p-4"}`}>
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
          <MapPin className="w-3 h-3" />
          <span>{listing.location}</span>
        </div>
        <p className="text-xl font-bold text-foreground mb-2">
          &#2547; {listing.price.toLocaleString()} / month
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {listing.facilities.slice(0, compact ? 2 : 4).map((f) => (
            <Badge key={f} variant="secondary" className="text-xs font-normal">
              {f}
            </Badge>
          ))}
        </div>
        {listing.aiMatch && (
          <Badge className="w-fit mb-3 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs">
            AI Match {listing.aiMatch}%
          </Badge>
        )}
        <div className="mt-auto">
          <Link href="/listing">
            <Button variant="outline" size="sm" className="w-full text-xs">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const mockListings: ListingData[] = [
  { id: "1", title: "Bachelor Seat — Mirpur-10", type: "Bachelor Seat", location: "Mirpur-10, Dhaka", price: 3500, facilities: ["WiFi", "No Smoking", "Water Included"], aiMatch: 94 },
  { id: "2", title: "Single Room — Dhanmondi", type: "Single Room", location: "Dhanmondi, Dhaka", price: 8000, facilities: ["WiFi", "Attached Bath", "Meals"], aiMatch: 88 },
  { id: "3", title: "Family Flat — Uttara", type: "Family Flat", location: "Uttara Sector-7, Dhaka", price: 15000, facilities: ["Line Gas", "WASA Water", "Parking"], aiMatch: 82 },
  { id: "4", title: "Bachelor Seat — Mohammadpur", type: "Bachelor Seat", location: "Mohammadpur, Dhaka", price: 2800, facilities: ["WiFi", "Meals", "Laundry"], aiMatch: 91 },
  { id: "5", title: "Sublet — Gulshan", type: "Sublet", location: "Gulshan-2, Dhaka", price: 12000, facilities: ["WiFi", "AC", "Attached Bath"], aiMatch: 76 },
  { id: "6", title: "Single Room — Farmgate", type: "Single Room", location: "Farmgate, Dhaka", price: 5500, facilities: ["WiFi", "No Smoking", "Rooftop"], aiMatch: 85 },
];
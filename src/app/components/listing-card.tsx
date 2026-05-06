import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";

export interface ListingData {
  id: string;
  title: string;
  propertyType?: string;
  type?: string; // Fallback
  location: string;
  price: number;
  amenities?: string[];
  facilities?: string[]; // Fallback
  aiMatch?: number;
  images?: string[];
  imageUrl?: string; // Fallback
}

export const mockListings: ListingData[] = [
  {
    id: "1",
    title: "Cozy Bachelor Seat",
    propertyType: "Bachelor",
    location: "Mirpur 10, Dhaka",
    price: 2800,
    amenities: ["WiFi", "No Smoking", "Water"],
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop"],
    aiMatch: 78,
  },
  {
    id: "2",
    title: "Family Flat Near DU",
    propertyType: "Family",
    location: "Dhanmondi, Dhaka",
    price: 12000,
    amenities: ["Gas", "Parking", "Lift"],
    images: ["https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200&auto=format&fit=crop"],
    aiMatch: 76,
  },
  {
    id: "3",
    title: "Single Room with Meal",
    propertyType: "Single",
    location: "Kataban, Dhaka",
    price: 3500,
    amenities: ["Meals", "WiFi", "Attached Bath"],
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop"],
    aiMatch: 98,
  },
];

export function ListingCard({ listing, compact }: { listing: any; compact?: boolean }) {
  // Map backend fields to frontend display
  const title = listing.title;
  const location = listing.location;
  const price = listing.price;
  const type = listing.propertyType || listing.type;
  const facilities = listing.amenities || listing.facilities || [];
  const imageUrl = (listing.images && listing.images.length > 0) ? listing.images[0] : listing.imageUrl;
  
  // Use provided AI match or default to 85 (no random generation to avoid hydration mismatch)
  const aiMatch = listing.aiMatch ?? 85;

  return (
    <div className="group rounded-lg border border-border bg-card shadow-sm hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
            No Image
          </div>
        )}
        <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs">
          {type}
        </Badge>
      </div>
      <div className={`flex flex-col flex-1 ${compact ? "p-3" : "p-4"}`}>
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{location}</span>
        </div>
        <h3 className="font-semibold text-sm line-clamp-1 mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xl font-bold text-foreground mb-2">
          &#2547; {price.toLocaleString()} / month
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {facilities.slice(0, compact ? 2 : 4).map((f: string) => (
            <Badge key={f} variant="secondary" className="text-[10px] font-normal px-1.5 py-0">
              {f}
            </Badge>
          ))}
        </div>
        <Badge className="w-fit mb-3 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-[10px] px-1.5 py-0">
          AI Match {aiMatch}%
        </Badge>
        <div className="mt-auto">
          <Link href={`/listing/${listing.id}`}>
            <Button variant="outline" size="sm" className="w-full text-xs h-8">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
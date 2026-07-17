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
  },
  {
    id: "2",
    title: "Family Flat Near DU",
    propertyType: "Family",
    location: "Dhanmondi, Dhaka",
    price: 12000,
    amenities: ["Gas", "Parking", "Lift"],
    images: ["https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200&auto=format&fit=crop"],
  },
  {
    id: "3",
    title: "Single Room with Meal",
    propertyType: "Single",
    location: "Kataban, Dhaka",
    price: 3500,
    amenities: ["Meals", "WiFi", "Attached Bath"],
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop"],
  },
];

export function ListingCard({ listing, compact, chatCompact }: { listing: any; compact?: boolean; chatCompact?: boolean }) {
  // Map backend fields to frontend display
  const title = listing.title;
  const location = listing.location;
  const price = listing.price;
  const type = listing.propertyType || listing.type;
  const facilities = listing.amenities || listing.facilities || [];
  const imageUrl = (listing.images && listing.images.length > 0) ? listing.images[0] : listing.imageUrl;

  if (chatCompact) {
    return (
      <div className="group rounded-md border border-border bg-card hover:bg-accent/30 transition-colors overflow-hidden">
        <div className="flex gap-2 p-2">
          <div className="w-16 h-16 rounded-md bg-muted overflow-hidden shrink-0">
            {imageUrl ? (
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-xs leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-xs font-bold shrink-0">&#2547; {price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-[10px] mt-1">
              <MapPin className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 flex-wrap">
              {type ? (
                <Badge variant="secondary" className="text-[9px] px-1 py-0 font-normal">
                  {type}
                </Badge>
              ) : null}
              {facilities.slice(0, 2).map((f: string) => (
                <Badge key={f} variant="outline" className="text-[9px] px-1 py-0 font-normal">
                  {f}
                </Badge>
              ))}
            </div>
            <div className="mt-2 flex gap-1.5">
              <Link href={`/listing/${listing.id}`} className="text-[10px] text-primary hover:underline">
                Details
              </Link>
              <span className="text-[10px] text-muted-foreground">/</span>
              <Link href={`/map?listingId=${listing.id}`} className="text-[10px] text-primary hover:underline">
                Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <p className={`${compact ? "text-lg" : "text-xl"} font-bold text-foreground mb-2`}>
          &#2547; {price.toLocaleString()} / month
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {facilities.slice(0, compact ? 2 : 4).map((f: string) => (
            <Badge key={f} variant="secondary" className="text-[10px] font-normal px-1.5 py-0">
              {f}
            </Badge>
          ))}
        </div>
        <div className="mt-auto">
          <div className="flex flex-col gap-2">
            <Link href={`/listing/${listing.id}`}>
              <Button variant="outline" size="sm" className="w-full text-xs h-8">
                View Details
              </Button>
            </Link>
            <Link href={`/map?listingId=${listing.id}`}>
              <Button variant="ghost" size="sm" className="w-full text-xs h-8">
                View on Map
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

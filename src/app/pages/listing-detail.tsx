import { useState, useEffect } from "react";
import {
  MapPin, Wifi, Wind, Bath, Flame, Zap, Droplets, CheckCircle,
  UtensilsCrossed, Navigation, MessageCircle, Phone, Bookmark, Share2, Flag,
  X, Download, Sparkles, Loader2, Calendar, Users, Home, Info
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BackButton } from "../components/back-button";
import { useGetListingQuery } from "../redux/features/listing/listingApi";
import { useGetSavedListingsQuery, useSaveListingMutation } from "../redux/features/listing/listingApi";
import { toast } from "sonner";

interface Listing {
  id: string;
  title: string;
  description: string | null;
  propertyType: string | null;
  price: number;
  location: string;
  address: string | null;
  city: string | null;
  images: string[];
  bedrooms: number | null;
  availableSeats: number | null;
  amenities: string[];
  availableFrom: string | null;
  isAvailable: boolean;
  advanceDeposit: number | null;
  negotiable: boolean | null;
  waterSupply: string | null;
  gasType: string | null;
  electricity: string | null;
  waterBill: string | null;
  parking: string | null;
  landmarks: string | null;
  minStay: string | null;
  preferredTenant: string[];
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    createdAt: string;
  };
}

export function ListingDetailPage() {
  const { id } = useParams() as { id: string };
  const { data, isLoading: loading } = useGetListingQuery(id || "");
  const listing = data?.listing as Listing | null;
  const [photocardOpen, setPhotocardOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { data: savedData } = useGetSavedListingsQuery();
  const [saveListing, { isLoading: saving }] = useSaveListingMutation();
  const savedIds = (savedData?.listings || []).map((l: any) => l.id);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (listing) setIsSaved(savedIds.includes(listing.id));
  }, [listing, savedIds.join("|")]);

  const handleSave = async () => {
    if (!listing) return;
    try {
      const res = await saveListing(listing.id).unwrap();
      setIsSaved(Boolean(res.saved));
      toast.success(res.saved ? "Saved listing" : "Removed from saved");
    } catch (err) {
      toast.error("Failed to update saved listing");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold mb-2">Listing Not Found</h1>
        <p className="text-muted-foreground mb-6">The listing you are looking for does not exist or has been removed.</p>
        <Link href="/search">
          <Button>Back to Search</Button>
        </Link>
      </div>
    );
  }

  const facilities = [
    { name: "WiFi Available", icon: Wifi, available: listing.amenities.includes("WiFi") },
    { name: "Meal Facility", icon: UtensilsCrossed, available: listing.amenities.includes("Meal Facility") },
    { name: "AC", icon: Wind, available: listing.amenities.includes("AC") },
    { name: "Attached Bathroom", icon: Bath, available: listing.amenities.includes("Attached Bathroom") },
    { name: "Parking", icon: Home, available: !!listing.parking },
  ];

  const details = [
    { label: "Water Supply", value: listing.waterSupply, icon: Droplets },
    { label: "Gas Type", value: listing.gasType, icon: Flame },
    { label: "Electricity", value: listing.electricity, icon: Zap },
    { label: "Water Bill", value: listing.waterBill, icon: CheckCircle },
  ];

  const landmarkList = listing.landmarks ? listing.landmarks.split(",").map(l => l.trim()) : [];

  return (
    <div className="px-4 md:px-8 lg:px-16 py-6">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 flex-wrap">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-foreground">Search</Link>
          <span>/</span>
          <span>{listing.location}</span>
          <span>/</span>
          <span className="text-foreground">{listing.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            {/* Gallery */}
            <div className="bg-muted rounded-xl aspect-video mb-3 overflow-hidden">
              {listing.images.length > 0 ? (
                <img src={listing.images[activeImage]} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No photos available</div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {listing.images.map((img, i) => (
                <div 
                  key={i} 
                  className={`bg-muted rounded-lg aspect-video overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border-2 ${activeImage === i ? "border-primary" : "border-transparent"}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <h1 className="text-2xl font-semibold tracking-tight mb-2">{listing.title}</h1>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
              <MapPin className="w-4 h-4" /> {listing.address || listing.location}, {listing.city || "Dhaka"}
            </div>
            <p className="text-3xl font-bold mb-3">৳ {listing.price.toLocaleString()} / month</p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <Badge className="bg-blue-100 dark:bg-primary/20 text-blue-600 dark:text-primary border border-blue-200 dark:border-primary/30">
                {listing.propertyType}
              </Badge>
              {listing.negotiable && (
                <Badge variant="secondary" className="text-green-600 dark:text-green-400">Negotiable</Badge>
              )}
              {listing.availableFrom && (
                <Badge variant="outline" className="flex gap-1 items-center">
                  <Calendar className="w-3 h-3" /> From {new Date(listing.availableFrom).toLocaleDateString()}
                </Badge>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Beds/Rooms</p>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{listing.bedrooms || "—"}</span>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Available Seats</p>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{listing.availableSeats || "—"}</span>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Advance Deposit</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-semibold">৳{listing.advanceDeposit?.toLocaleString() || "0"}</Badge>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Min. Stay</p>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{listing.minStay || "No minimum"}</span>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <h2 className="text-lg font-semibold tracking-tight mb-4">Facilities & Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {facilities.map((f) => (
                <div key={f.name} className={`bg-card border rounded-lg p-3 flex items-center gap-2.5 ${f.available ? "border-border" : "border-border/50 opacity-60"}`}>
                  <f.icon className={`w-4 h-4 ${f.available ? "text-green-400" : "text-red-400"}`} />
                  <div>
                    <p className="text-xs">{f.name}</p>
                    <span className={`text-[10px] ${f.available ? "text-green-400" : "text-red-400"}`}>
                      {f.available ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Utility Details */}
            <h2 className="text-lg font-semibold tracking-tight mb-4">Utility Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {details.map((d) => (
                <div key={d.label} className="bg-card border rounded-lg p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <d.icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-wider font-medium">{d.label}</span>
                  </div>
                  <p className="text-sm font-semibold">{d.value || "—"}</p>
                </div>
              ))}
            </div>

            {/* Landmarks */}
            {landmarkList.length > 0 && (
              <>
                <h2 className="text-lg font-semibold tracking-tight mb-4 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-primary" /> Nearby Landmarks (AI Detected)
                </h2>
                <div className="bg-card border border-border rounded-lg divide-y divide-border mb-8">
                  {landmarkList.map((l, i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <span className="text-lg">📍</span>
                      <span className="text-sm font-medium flex-1">{l}</span>
                      <span className="text-xs text-muted-foreground">Nearby</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2 className="text-lg font-semibold tracking-tight mb-3">About This Listing</h2>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap mb-8">
              {listing.description || "No description provided."}
            </div>
            
            <h2 className="text-lg font-semibold tracking-tight mb-3">Preferred Tenant</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {listing.preferredTenant.length > 0 ? (
                listing.preferredTenant.map(t => (
                  <Badge key={t} variant="secondary" className="bg-primary/10 text-primary border-primary/20">{t}</Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No specific preference</span>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-20 space-y-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                    {listing.owner.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{listing.owner.name}</p>
                    <p className="text-xs text-muted-foreground">Member since {new Date(listing.owner.createdAt).getFullYear()}</p>
                  </div>
                </div>
                <Link href={`/messages?ownerId=${listing.owner.id}&listingId=${listing.id}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90 gap-2 mb-2">
                    <MessageCircle className="w-4 h-4" /> Send Message
                  </Button>
                </Link>
                {listing.owner.phone && (
                  <Button variant="outline" className="w-full gap-2 mb-3" onClick={() => window.location.href = `tel:${listing.owner.phone}`}>
                    <Phone className="w-4 h-4" /> {listing.owner.phone}
                  </Button>
                )}
                <p className="text-[10px] text-muted-foreground text-center">
                  Be careful while sending money in advance.
                </p>
              </div>

              <Button variant="outline" className="w-full gap-2" onClick={handleSave} disabled={saving}>
                <Bookmark className="w-4 h-4" /> {saving ? "Updating..." : isSaved ? "Unsave Listing" : "Save Listing"}
              </Button>
              <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={() => setPhotocardOpen(true)}>
                <Share2 className="w-4 h-4" /> Share Photocard
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {/* Photocard Modal */}
      {photocardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setPhotocardOpen(false)}>
          <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPhotocardOpen(false)} className="absolute -top-10 right-0 text-white hover:text-white/80 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-square bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
              <div className="flex-1 bg-muted flex items-center justify-center text-muted-foreground text-sm relative">
                {listing.images.length > 0 ? (
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <span>Listing Photo</span>
                )}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary/90 text-primary-foreground text-xs">{listing.propertyType}</Badge>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold">{listing.title}</h3>
                <p className="text-2xl font-bold text-primary">৳ {listing.price.toLocaleString()} / month</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" /> {listing.location}, {listing.city || "Dhaka"}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold">BashaAI</span>
                  </div>
                </div>
              </div>
            </div>
            <Button className="w-full mt-3 bg-primary hover:bg-primary/90 gap-2" onClick={() => alert("Photocard downloaded! (Demo)")}>
              <Download className="w-4 h-4" /> Download Photocard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
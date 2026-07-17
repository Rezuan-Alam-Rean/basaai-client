"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Bookmark,
  MessageCircle,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Loader2,
  BookmarkMinus,
  MapPin,
  Home,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/features/auth/authSlice";
import { useGetSavedListingsQuery, useSaveListingMutation } from "../redux/features/listing/listingApi";
import { toast } from "sonner";

const seekerNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/seeker" },
  { icon: Bookmark, label: "Saved Listings", path: "/saved-listings" },
  { icon: MessageCircle, label: "My Chats", path: "/messages" },
  { icon: Sparkles, label: "AI Chat History", path: "/ai-history" },
  { icon: Settings, label: "Account Settings", path: "/settings" },
  { icon: LogOut, label: "Logout", path: "/" },
];

interface ListingWithOwner {
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
  owner: {
    id: string;
    name: string;
  };
}

export function SavedListingsPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data, isLoading } = useGetSavedListingsQuery();
  const listings = (data?.listings || []) as ListingWithOwner[];
  const [saveListing] = useSaveListingMutation();
  const initials = user?.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U";

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const handleUnsave = async (listingId: string) => {
    try {
      const res = await saveListing(listingId).unwrap();
      if (res?.saved) {
        toast.success("Saved listing");
      } else {
        toast.success("Removed from saved");
      }
    } catch (err) {
      toast.error("Failed to remove from saved");
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <button
        className="lg:hidden fixed bottom-20 right-4 z-30 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-20 w-64 h-full bg-card border-r border-border flex flex-col transition-transform`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">{initials}</div>
            <div>
              <p className="text-sm font-semibold truncate max-w-[140px]">{user?.name || "Guest User"}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()} Account</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {seekerNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              onClick={() => {
                setSidebarOpen(false);
                if (item.label === "Logout") handleLogout();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                item.label === "Saved Listings"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="w-full">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary" /> Saved Listings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Your recent saved listings are shown here</p>
          </div>

          {isLoading ? (
            <div className="min-h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin text-primary mr-2" /> Loading saved listings...
            </div>
          ) : listings.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="font-medium text-foreground mb-1">No saved listings yet</p>
              <p className="mb-4">Save listings from the details page to show them here.</p>
              <Link href="/search">
                <Button className="bg-primary hover:bg-primary/90">Browse Listings</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">You have {listings.length} saved listing{listings.length !== 1 ? "s" : ""}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No photo
                        </div>
                      )}
                      <button
                        onClick={() => handleUnsave(listing.id)}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-destructive/20 transition-colors group"
                        title="Remove from saved"
                      >
                        <BookmarkMinus className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                      </button>
                      <Badge className="absolute bottom-3 left-3 bg-primary/90">{listing.propertyType || "Property"}</Badge>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-2">{listing.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="line-clamp-1">{listing.location}</span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <p className="text-2xl font-bold text-primary">৳{listing.price.toLocaleString()}</p>
                        <span className="text-xs text-muted-foreground">/month</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-border">
                        {listing.bedrooms && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Home className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{listing.bedrooms} bed{listing.bedrooms !== 1 ? "s" : ""}</span>
                          </div>
                        )}
                        {listing.availableSeats && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Users className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{listing.availableSeats} seat{listing.availableSeats !== 1 ? "s" : ""}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                            {listing.owner.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-muted-foreground truncate">{listing.owner.name}</span>
                        </div>
                        <Link href={`/listing/${listing.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

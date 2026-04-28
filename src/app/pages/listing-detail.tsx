"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin, Wifi, Wind, Bath, Flame, Zap, Droplets, CheckCircle,
  UtensilsCrossed, Navigation, MessageCircle, Phone, Bookmark, Share2, Flag,
  X, Download, Sparkles
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { BackButton } from "../components/back-button";

const facilities = [
  { name: "WiFi Available", icon: Wifi, available: true },
  { name: "Meal Facility", icon: UtensilsCrossed, available: false },
  { name: "No Smokers", icon: Wind, available: true },
  { name: "Attached Bathroom", icon: Bath, available: true },
  { name: "Line Gas", icon: Flame, available: true },
  { name: "Prepaid Meter", icon: Zap, available: true },
  { name: "WASA Water Line", icon: Droplets, available: true },
  { name: "Water Bill Included", icon: CheckCircle, available: true },
];

const landmarks = [
  { emoji: "\uD83D\uDD4C", name: "Al-Amin Mosque", dist: "120m away" },
  { emoji: "\uD83D\uDE8C", name: "Mirpur-10 Bus Stand", dist: "200m away" },
  { emoji: "\uD83C\uDFE5", name: "National Heart Foundation Hospital", dist: "1.2km away" },
  { emoji: "\uD83C\uDF93", name: "BRAC University", dist: "800m away" },
  { emoji: "\uD83C\uDFEA", name: "Agora Supermarket", dist: "350m away" },
];

export function ListingDetailPage() {
  const [photocardOpen, setPhotocardOpen] = useState(false);
  return (
    <div className="px-4 md:px-8 lg:px-16 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <BackButton />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 flex-wrap">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-foreground">Search</Link>
          <span>/</span>
          <span>Mirpur-10</span>
          <span>/</span>
          <span className="text-foreground">This Listing</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Image gallery */}
            <div className="bg-muted rounded-xl aspect-video mb-3 flex items-center justify-center text-muted-foreground text-sm">
              Primary Image
            </div>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-muted rounded-lg aspect-video flex items-center justify-center text-[10px] text-muted-foreground cursor-pointer hover:opacity-80 transition-opacity">
                  Photo {i}
                </div>
              ))}
            </div>

            {/* Header */}
            <h1 className="text-2xl font-semibold tracking-tight mb-2">
              Spacious Bachelor Seat — Mirpur-10, Dhaka
            </h1>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
              <MapPin className="w-4 h-4" /> Mirpur-10, Dhaka
            </div>
            <p className="text-3xl font-bold mb-3">&#2547; 3,500 / month</p>
            <div className="flex flex-wrap gap-2 mb-8">
              <Badge className="bg-blue-100 dark:bg-primary/20 text-blue-600 dark:text-primary border border-blue-200 dark:border-primary/30">Bachelor Seat</Badge>
              <Badge variant="secondary" className="text-green-600 dark:text-green-400">Verified &#10003;</Badge>
              <Badge className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">AI Match 96%</Badge>
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

            {/* Landmarks */}
            <h2 className="text-lg font-semibold tracking-tight mb-4 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" /> Nearby Landmarks (AI Detected)
            </h2>
            <div className="bg-card border border-border rounded-lg divide-y divide-border mb-8">
              {landmarks.map((l) => (
                <div key={l.name} className="flex items-center gap-3 p-3">
                  <span className="text-lg">{l.emoji}</span>
                  <span className="text-sm font-medium flex-1">{l.name}</span>
                  <span className="text-xs text-muted-foreground">{l.dist}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <h2 className="text-lg font-semibold tracking-tight mb-3">About This Listing</h2>
            <div className="text-sm text-muted-foreground space-y-3 mb-8">
              <p>
                This spacious bachelor seat is located in the heart of Mirpur-10, one of Dhaka&apos;s most well-connected areas.
                The room is part of a well-maintained residential building with 24-hour security and a clean common area.
                It&apos;s perfect for students and working professionals who need affordable accommodation close to major transport links.
              </p>
              <p>
                The building is within walking distance of Mirpur-10 bus stand and metro station, making daily commutes
                hassle-free. Nearby you&apos;ll find mosques, grocery shops, pharmacies, and several popular restaurants.
                The neighborhood is generally quiet and safe, with a friendly community atmosphere.
              </p>
              <p>
                Rent includes water and electricity bills (prepaid meter). WiFi is shared among tenants at a nominal monthly
                charge. The seat comes with a single bed, a wardrobe, and a study desk. Attached bathroom is shared between
                two tenants. No smoking is strictly enforced on the premises.
              </p>
            </div>

            {/* Map Preview */}
            <h2 className="text-lg font-semibold tracking-tight mb-3">Location</h2>
            <div className="relative bg-muted rounded-lg h-48 mb-2 flex items-center justify-center" style={{
              backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  &#2547;3,500
                </div>
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-primary" />
              </div>
            </div>
            <Link href="/map">
              <Button variant="link" className="text-primary text-xs px-0">View on Full Map &rarr;</Button>
            </Link>
          </div>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* Contact Card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">K</div>
                  <div>
                    <p className="text-sm font-semibold">Kamal Hossain</p>
                    <p className="text-xs text-muted-foreground">Member since 2023</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 mb-4">
                  <p>Response rate: <span className="text-foreground font-medium">95%</span></p>
                  <p>Usually replies in <span className="text-foreground font-medium">1 hour</span></p>
                </div>
                <Link href="/messages">
                  <Button className="w-full bg-primary hover:bg-primary/90 gap-2 mb-2">
                    <MessageCircle className="w-4 h-4" /> Send Message
                  </Button>
                </Link>
                <Button variant="outline" className="w-full gap-2 mb-3">
                  <Phone className="w-4 h-4" /> Call Now
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">
                  Your number stays private until you choose to share it
                </p>
              </div>

              <Button variant="outline" className="w-full gap-2">
                <Bookmark className="w-4 h-4" /> Save Listing
              </Button>
              <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={() => setPhotocardOpen(true)}>
                <Share2 className="w-4 h-4" /> Share Photocard
              </Button>
              <Button variant="ghost" className="w-full gap-2 text-destructive hover:text-destructive">
                <Flag className="w-4 h-4" /> Report Listing
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {/* Photocard Modal */}
      {photocardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setPhotocardOpen(false)}>
          <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {/* Close */}
            <button
              onClick={() => setPhotocardOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-white/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Photocard */}
            <div id="photocard" className="aspect-square bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
              {/* Image area */}
              <div className="flex-1 bg-muted flex items-center justify-center text-muted-foreground text-sm relative">
                <span>Listing Photo</span>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary/90 text-primary-foreground text-xs">Bachelor Seat</Badge>
                </div>
              </div>

              {/* Info area */}
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold">Spacious Bachelor Seat</h3>
                <p className="text-2xl font-bold text-primary">&#2547; 3,500 / month</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" /> Mirpur-10, Dhaka
                </div>

                {/* Landmarks */}
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Nearby</p>
                  <div className="flex flex-wrap gap-1.5">
                    {landmarks.slice(0, 3).map((l) => (
                      <span key={l.name} className="text-xs bg-muted px-2 py-1 rounded-md">
                        {l.emoji} {l.name} &middot; {l.dist}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Branding */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold">BashaAI</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">bashaai.com</span>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <Button
              className="w-full mt-3 bg-primary hover:bg-primary/90 gap-2"
              onClick={() => {
                // In a real app this would use html2canvas
                alert("Photocard downloaded! (Demo)");
              }}
            >
              <Download className="w-4 h-4" /> Download Photocard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
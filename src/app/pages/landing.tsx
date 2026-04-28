"use client";

import { useState } from "react";
import {
  Sparkles, Map, SlidersHorizontal, Navigation, ShieldCheck, MessageCircle,
  Search, Home, Star
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { ListingCard, mockListings } from "../components/listing-card";
import Link from "next/link";

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-blue-400"
          style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export function LandingPage() {
  const [chatInput, setChatInput] = useState("");

  const features = [
    { icon: Sparkles, title: "AI-Powered Matching", desc: "Describe your needs in plain Bangla or English. Our AI finds the best matches instantly." },
    { icon: Map, title: "Map-Based Search", desc: "Search listings within 500m, 1km or 2km radius from any location in Bangladesh." },
    { icon: SlidersHorizontal, title: "Smart Facility Filters", desc: "Filter by WiFi, meals, gas type, water supply, smoking policy, prepaid/postpaid electricity and more." },
    { icon: Navigation, title: "Auto Landmark Detection", desc: "AI auto-detects and displays nearby mosques, bus stands, hospitals, universities, and markets." },
    { icon: ShieldCheck, title: "Verified Listings", desc: "All listings go through a verification step to ensure accuracy and trustworthiness." },
    { icon: MessageCircle, title: "Direct Messaging", desc: "Chat directly with room owners or tenants without sharing your phone number publicly." },
  ];

  const reviews = [
    { name: "Rahim Uddin", role: "Seeker", text: "I found a bachelor seat near Moghbazar in just 2 minutes by describing what I needed. The AI understood my budget perfectly." },
    { name: "Nasrin Akter", role: "Lister", text: "I listed my room and got 3 genuine inquiries within the first day. The verification process makes tenants trust my listing." },
    { name: "Kamal Hossain", role: "Seeker", text: "The map view helped me find rooms within walking distance of my office in Gulshan. Saved me weeks of searching." },
  ];

  const quickPrompts = [
    "Bachelor seat near Mirpur 10",
    "Family flat under 12,000৳ in Dhanmondi",
    "Single room with meal facility near BUET",
  ];

  return (
    <div>
      {/* Hero / AI Chat Section */}
      <section className="px-4 md:px-8 lg:px-16 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Find Your Perfect Basha with AI
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Describe what you&apos;re looking for - BashaAI will find it for you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl p-4 md:p-6 shadow-lg dark:shadow-none shadow-black/5">
          {/* Mock chat */}
          <div className="space-y-4 mb-6">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none px-4 py-3 max-w-[85%] text-sm">
                I need a bachelor seat near Dhaka University, max 3000 taka, WiFi needed, no smokers
              </div>
            </div>

            {/* AI thinking */}
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg rounded-tl-none px-4 py-2 ring-1 ring-blue-500/20">
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-1">
                  <Sparkles className="w-3 h-3" />
                  BashaAI is searching...
                </div>
                <TypingDots />
              </div>
            </div>

            {/* AI response */}
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg rounded-tl-none px-4 py-3 max-w-[90%] ring-1 ring-blue-500/20">
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-2">
                  <Sparkles className="w-3 h-3" />
                  BashaAI
                </div>
                <p className="text-sm mb-3">I found 3 matching listings for you:</p>
                <div className="space-y-2">
                  {[
                    { loc: "Nilkhet, Near DU Campus", price: "৳2,800/mo", tags: ["WiFi ✓", "No Smoking ✓", "Water Included ✓"] },
                    { loc: "Kataban, Dhaka", price: "৳3,000/mo", tags: ["WiFi ✓", "No Smoking ✓", "Meals Available"] },
                    { loc: "Palashi, Near TSC", price: "৳2,500/mo", tags: ["WiFi ✓", "No Smoking ✓", "Attached Bath"] },
                  ].map((r, i) => (
                    <div key={i} className="bg-background/50 rounded-md p-2.5 border border-border/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-foreground font-medium">{r.loc}</span>
                        <span className="text-xs font-bold text-primary">{r.price}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {r.tags.map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2 mb-3">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => setChatInput(p)}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat input */}
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Describe your ideal room, location, budget..."
                className="pr-4 bg-background border-border ring-1 ring-blue-500/30 focus:ring-blue-500/60"
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90 gap-2 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Ask BashaAI</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Recently Added Listings</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {mockListings.map((l) => (
              <div key={l.id} className="min-w-[280px] max-w-[300px] snap-start">
                <ListingCard listing={l} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight mb-8 text-center">Why BashaAI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight mb-8 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.name} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl p-6 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold tracking-tight mb-2">Join BashaAI Today</h2>
            <p className="text-sm text-muted-foreground">Are you looking for a place, or do you have a place to offer?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
              <Search className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">I&apos;m a Seeker</h3>
              <p className="text-sm text-muted-foreground mb-4">Find bachelor seats, rooms and flats that match your exact needs using AI.</p>
              <Link href="/seeker">
                <Button className="bg-primary hover:bg-primary/90 w-full">Create Seeker Account</Button>
              </Link>
            </div>
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border border-border items-center justify-center text-xs text-muted-foreground z-10">
              or
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
              <Home className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">I&apos;m a Lister</h3>
              <p className="text-sm text-muted-foreground mb-4">Post your room or house listing and reach thousands of verified seekers.</p>
              <Link href="/lister">
                <Button variant="outline" className="w-full">Create Lister Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
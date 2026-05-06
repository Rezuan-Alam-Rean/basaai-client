"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sparkles, Map, SlidersHorizontal, Navigation, ShieldCheck, MessageCircle,
  Search, Home, Star
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { ListingCard, mockListings, type ListingData } from "../components/listing-card";
import Link from "next/link";
import { useAppSelector } from "../redux/hooks";
import { useAiChat } from "../components/use-ai-chat";
import { useGetListingsQuery } from "../redux/features/listing/listingApi";

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
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = Boolean(user);
  const [mounted, setMounted] = useState(false);
  const [isChatFullscreen, setIsChatFullscreen] = useState(false);
  const {
    chatInput,
    setChatInput,
    messages,
    isTyping,
    listingPageByMsg,
    setListingPageByMsg,
    handleSend,
  } = useAiChat(isAuthenticated);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const listingsPerPage = 4;
  const { data: latestListingsData } = useGetListingsQuery({ page: 1, limit: 4, sortBy: "newest" });
  const latestListings: ListingData[] = latestListingsData?.listings || mockListings;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isChatFullscreen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsChatFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatFullscreen]);

  useEffect(() => {
    document.body.classList.toggle("hide-floating-chat", isChatFullscreen);
    return () => document.body.classList.remove("hide-floating-chat");
  }, [isChatFullscreen]);

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
      <section id="live-ai-chat" className="px-4 md:px-8 lg:px-16 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center mb-8">
          {mounted && isAuthenticated ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Welcome back, {user?.name || "User"}! 👋
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Continue your search or explore new listings with AI assistance.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Find Your Perfect Basha with AI
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Describe what you're looking for — BashaAI will find it for you.
              </p>
            </>
          )}
        </div>

        <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl p-4 md:p-6 shadow-lg dark:shadow-none shadow-black/5 flex flex-col h-[520px] sm:h-[560px] md:h-[600px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Live AI Chat
            </div>
            <button
              type="button"
              onClick={() => setIsChatFullscreen(true)}
              className="text-xs px-2.5 py-1 rounded-full border border-border bg-background hover:bg-accent transition-colors"
            >
              Full screen
            </button>
          </div>
          <div className="space-y-4 mb-6 flex-1 overflow-y-auto pr-1">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] px-4 py-3 text-sm ring-1 ring-blue-500/20 ${
                  m.from === "user"
                    ? "bg-primary text-primary-foreground rounded-lg rounded-tr-none"
                    : "bg-muted rounded-lg rounded-tl-none"
                }`}>
                  {m.from === "ai" && (
                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-1">
                      <Sparkles className="w-3 h-3" />
                      BashaAI
                    </div>
                  )}
                  <p>{m.text}</p>
                  {m.from === "ai" && m.listings && m.listings.length > 0 && (() => {
                    const currentPage = listingPageByMsg[m.id] ?? 1;
                    const totalPages = Math.ceil(m.listings.length / listingsPerPage);
                    const startIndex = (currentPage - 1) * listingsPerPage;
                    const pageListings = m.listings.slice(startIndex, startIndex + listingsPerPage);

                    return (
                      <div className="mt-3">
                        <div className="grid gap-2 sm:grid-cols-2">
                          {pageListings.map((l) => (
                            <div key={l.id} className="bg-background/60 rounded-lg border border-border/60 p-1">
                              <ListingCard listing={l} compact />
                            </div>
                          ))}
                        </div>
                        {totalPages > 1 && (
                          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>Page {currentPage} of {totalPages}</span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setListingPageByMsg((prev) => ({
                                    ...prev,
                                    [m.id]: Math.max(1, currentPage - 1),
                                  }))
                                }
                                className="px-2 py-1 rounded border border-border bg-background hover:bg-accent disabled:opacity-50"
                                disabled={currentPage <= 1}
                              >
                                Prev
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setListingPageByMsg((prev) => ({
                                    ...prev,
                                    [m.id]: Math.min(totalPages, currentPage + 1),
                                  }))
                                }
                                className="px-2 py-1 rounded border border-border bg-background hover:bg-accent disabled:opacity-50"
                                disabled={currentPage >= totalPages}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  <p className={`text-[10px] mt-2 ${m.from === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {m.time}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg rounded-tl-none px-4 py-2 ring-1 ring-blue-500/20">
                  <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-1">
                    <Sparkles className="w-3 h-3" />
                    BashaAI is searching...
                  </div>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2 mb-3">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                disabled={!isAuthenticated}
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
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Describe your ideal room, location, budget..."
                className="pr-4 bg-background border-border ring-1 ring-blue-500/30 focus:ring-blue-500/60"
                disabled={!isAuthenticated}
              />
            </div>
            <Button
              onClick={() => handleSend()}
              className="bg-primary hover:bg-primary/90 gap-2 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              disabled={!isAuthenticated}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Ask BashaAI</span>
            </Button>
          </div>
          {!isAuthenticated && (
            <div className="mt-3 text-xs text-muted-foreground">
              Please <Link href="/login" className="text-primary hover:underline">log in</Link> to use BashaAI chat.
            </div>
          )}
        </div>
      </section>

      {isChatFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 sm:p-8">
          <div className="h-full max-w-5xl mx-auto bg-card border border-border rounded-2xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-primary" />
                BashaAI Chat
              </div>
              <button
                type="button"
                onClick={() => setIsChatFullscreen(false)}
                className="text-xs px-2.5 py-1 rounded-full border border-border bg-background hover:bg-accent transition-colors"
                aria-label="Exit full screen"
              >
                Exit
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="space-y-4 mb-6 flex-1 overflow-y-auto px-4 sm:px-6 pt-4 pr-5">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[90%] px-4 py-3 text-sm ring-1 ring-blue-500/20 ${
                      m.from === "user"
                        ? "bg-primary text-primary-foreground rounded-lg rounded-tr-none"
                        : "bg-muted rounded-lg rounded-tl-none"
                    }`}>
                      {m.from === "ai" && (
                        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-1">
                          <Sparkles className="w-3 h-3" />
                          BashaAI
                        </div>
                      )}
                      <p>{m.text}</p>
                      {m.from === "ai" && m.listings && m.listings.length > 0 && (() => {
                        const currentPage = listingPageByMsg[m.id] ?? 1;
                        const totalPages = Math.ceil(m.listings.length / listingsPerPage);
                        const startIndex = (currentPage - 1) * listingsPerPage;
                        const pageListings = m.listings.slice(startIndex, startIndex + listingsPerPage);

                        return (
                          <div className="mt-3">
                            <div className="grid gap-2 sm:grid-cols-2">
                              {pageListings.map((l) => (
                                <div key={l.id} className="bg-background/60 rounded-lg border border-border/60 p-1">
                                  <ListingCard listing={l} compact />
                                </div>
                              ))}
                            </div>
                            {totalPages > 1 && (
                              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                                <span>Page {currentPage} of {totalPages}</span>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setListingPageByMsg((prev) => ({
                                        ...prev,
                                        [m.id]: Math.max(1, currentPage - 1),
                                      }))
                                    }
                                    className="px-2 py-1 rounded border border-border bg-background hover:bg-accent disabled:opacity-50"
                                    disabled={currentPage <= 1}
                                  >
                                    Prev
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setListingPageByMsg((prev) => ({
                                        ...prev,
                                        [m.id]: Math.min(totalPages, currentPage + 1),
                                      }))
                                    }
                                    className="px-2 py-1 rounded border border-border bg-background hover:bg-accent disabled:opacity-50"
                                    disabled={currentPage >= totalPages}
                                  >
                                    Next
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      <p className={`text-[10px] mt-2 ${m.from === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {m.time}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg rounded-tl-none px-4 py-2 ring-1 ring-blue-500/20">
                      <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-1">
                        <Sparkles className="w-3 h-3" />
                        BashaAI is searching...
                      </div>
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="px-4 sm:px-6 pb-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickPrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => handleSend(p)}
                      disabled={!isAuthenticated}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Describe your ideal room, location, budget..."
                      className="pr-4 bg-background border-border ring-1 ring-blue-500/30 focus:ring-blue-500/60"
                      disabled={!isAuthenticated}
                    />
                  </div>
                  <Button
                    onClick={() => handleSend()}
                    className="bg-primary hover:bg-primary/90 gap-2 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    disabled={!isAuthenticated}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Ask BashaAI</span>
                  </Button>
                </div>
                {!isAuthenticated && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    Please <Link href="/login" className="text-primary hover:underline">log in</Link> to use BashaAI chat.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Latest Listings */}
      <section className="px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Recently Added Listings</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {latestListings.map((l) => (
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
              <h3 className="text-lg font-semibold mb-2">I'm a Seeker</h3>
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
              <h3 className="text-lg font-semibold mb-2">I'm a Lister</h3>
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
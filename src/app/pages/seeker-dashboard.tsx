"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import {
  LayoutDashboard, Bookmark, MessageCircle, Sparkles, Settings, LogOut,
  BookmarkMinus, Menu, X
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ListingCard, mockListings } from "../components/listing-card";
import Link from "next/link";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/seeker" },
  { icon: Bookmark, label: "Saved Listings", path: "/seeker/saved-listings" },
  { icon: MessageCircle, label: "My Chats", path: "/messages" },
  { icon: Sparkles, label: "AI Chat History", path: "/ai-history" },
  { icon: Settings, label: "Account Settings", path: "/settings" },
  { icon: LogOut, label: "Logout", path: "/" },
];

const searchHistory = [
  { query: "Bachelor seat near Farmgate under 4000 taka with WiFi", time: "2 hours ago", results: 8 },
  { query: "Room with meal facility in Mohammadpur", time: "5 hours ago", results: 12 },
  { query: "Single room Dhanmondi attached bathroom", time: "Yesterday", results: 6 },
];

export function SeekerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isSavedListingsPage = pathname === "/seeker/saved-listings";

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed bottom-20 right-4 z-30 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-20 w-64 h-full bg-card border-r border-border flex flex-col transition-transform`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">R</div>
            <div>
              <p className="text-sm font-semibold">Rahim Uddin</p>
              <p className="text-xs text-muted-foreground">Seeker Account</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((n) => (
            <Link
              key={n.label}
              href={n.path as Route}
              onClick={() => { setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                pathname === n.path ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-5xl">
          {isSavedListingsPage ? (
            <>
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Saved Listings</h1>
                  <p className="text-sm text-muted-foreground">Track the listings you saved while searching for a place.</p>
                </div>
                <Link href="/search">
                  <Button className="bg-primary hover:bg-primary/90">Find More Listings</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Saved Listings", value: mockListings.slice(0, 4).length.toString() },
                  { label: "Active Chats", value: "3" },
                  { label: "AI Searches Today", value: "5" },
                ].map((s) => (
                  <div key={s.label} className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold tracking-tight mb-4">Your Saved Listings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mockListings.slice(0, 4).map((l) => (
                    <div key={l.id} className="relative">
                      <ListingCard listing={l} compact />
                      <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-card/80 flex items-center justify-center hover:bg-destructive/20 transition-colors group">
                        <BookmarkMinus className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Recommended For You
                </h2>
                <p className="text-xs text-muted-foreground mb-4">AI thinks you&apos;ll like these based on your searches</p>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {mockListings.slice(2, 5).map((l) => (
                    <div key={l.id} className="min-w-[260px] max-w-[280px]">
                      <ListingCard listing={l} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Greeting */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Good morning, Rahim <span role="img">&#128075;</span></h1>
                <p className="text-sm text-muted-foreground">You have 3 new matches today</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Saved Listings", value: "8" },
                  { label: "Active Chats", value: "3" },
                  { label: "AI Searches Today", value: "5" },
                ].map((s) => (
                  <div key={s.label} className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* AI Search History */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold tracking-tight mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> AI Search History
                </h2>
                <div className="bg-card border border-border rounded-lg divide-y divide-border">
                  {searchHistory.map((s, i) => (
                    <div key={i} className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-sm">{s.query}</p>
                        <p className="text-xs text-muted-foreground">{s.time} &middot; {s.results} results</p>
                      </div>
                      <Link href="/search">
                        <Button variant="ghost" size="sm" className="text-primary text-xs">View Results</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Listings */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold tracking-tight mb-4">Saved Listings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mockListings.slice(0, 4).map((l) => (
                    <div key={l.id} className="relative">
                      <ListingCard listing={l} compact />
                      <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-card/80 flex items-center justify-center hover:bg-destructive/20 transition-colors group">
                        <BookmarkMinus className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended */}
              <div>
                <h2 className="text-lg font-semibold tracking-tight mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Recommended For You
                </h2>
                <p className="text-xs text-muted-foreground mb-4">AI thinks you&apos;ll like these based on your searches</p>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {mockListings.slice(2, 5).map((l) => (
                    <div key={l.id} className="min-w-[260px] max-w-[280px]">
                      <ListingCard listing={l} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
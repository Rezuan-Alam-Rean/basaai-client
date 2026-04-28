"use client";

import { useState } from "react";
import {
  LayoutDashboard, Bookmark, MessageCircle, Sparkles, Settings, LogOut,
  Menu, X, ArrowLeft, Clock, ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import Link from "next/link";
import type { Route } from "next";
import { BackButton } from "../components/back-button";

const seekerNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/seeker" },
  { icon: Bookmark, label: "Saved Listings", path: "/seeker/saved-listings" },
  { icon: MessageCircle, label: "My Chats", path: "/messages" },
  { icon: Sparkles, label: "AI Chat History", path: "/ai-history" },
  { icon: Settings, label: "Account Settings", path: "/settings" },
  { icon: LogOut, label: "Logout", path: "/" },
];

const chatSessions = [
  {
    id: 1,
    title: "Bachelor seat near Farmgate under 4000 taka with WiFi",
    summary: "Searched for affordable bachelor seats in Farmgate area with WiFi facility",
    date: "Apr 12, 2026",
    time: "10:30 AM",
    results: 8,
    messages: [
      { from: "user" as const, text: "I need a bachelor seat near Farmgate, max 4000 taka, WiFi needed" },
      { from: "ai" as const, text: "I found 8 matching listings in the Farmgate area within your budget. Here are the top picks:" },
      { from: "ai" as const, text: "", suggestions: [
        { title: "Bachelor Seat — Farmgate", price: "৳3,800", match: "96%" },
        { title: "Bachelor Seat — Green Road", price: "৳3,500", match: "92%" },
        { title: "Single Room — Panthapath", price: "৳4,000", match: "88%" },
      ]},
      { from: "user" as const, text: "The Farmgate one looks great. Is it close to any bus stops?" },
      { from: "ai" as const, text: "Yes! The Farmgate listing is 150m from Farmgate Bus Stand and 300m from Karwan Bazar. It also has a mosque within 200m and several restaurants nearby." },
    ],
  },
  {
    id: 2,
    title: "Room with meal facility in Mohammadpur",
    summary: "Looking for rooms with included meal service in Mohammadpur",
    date: "Apr 12, 2026",
    time: "5:15 AM",
    results: 12,
    messages: [
      { from: "user" as const, text: "Find me rooms in Mohammadpur with meal facility included" },
      { from: "ai" as const, text: "I found 12 listings in Mohammadpur that offer meal facilities. Here are the best matches:" },
      { from: "ai" as const, text: "", suggestions: [
        { title: "Bachelor Seat — Mohammadpur", price: "৳4,500", match: "94%" },
        { title: "Single Room — Town Hall", price: "৳6,000", match: "91%" },
      ]},
    ],
  },
  {
    id: 3,
    title: "Single room Dhanmondi attached bathroom",
    summary: "Single room search in Dhanmondi area with private bathroom",
    date: "Apr 11, 2026",
    time: "3:20 PM",
    results: 6,
    messages: [
      { from: "user" as const, text: "I want a single room in Dhanmondi with an attached bathroom" },
      { from: "ai" as const, text: "Found 6 single rooms in Dhanmondi with attached bathrooms. Here are the top results:" },
      { from: "ai" as const, text: "", suggestions: [
        { title: "Single Room — Dhanmondi 27", price: "৳8,000", match: "95%" },
        { title: "Single Room — Dhanmondi 15", price: "৳7,500", match: "90%" },
      ]},
    ],
  },
  {
    id: 4,
    title: "Family flat in Uttara under 15,000 taka",
    summary: "3-bedroom family flat search in Uttara area",
    date: "Apr 10, 2026",
    time: "11:00 AM",
    results: 4,
    messages: [
      { from: "user" as const, text: "Find family flats in Uttara, 3 bedrooms, under 15,000 taka" },
      { from: "ai" as const, text: "I found 4 family flats in Uttara matching your criteria:" },
      { from: "ai" as const, text: "", suggestions: [
        { title: "Family Flat 3BR — Uttara Sector 7", price: "৳14,000", match: "93%" },
        { title: "Family Flat 3BR — Uttara Sector 11", price: "৳13,500", match: "89%" },
      ]},
    ],
  },
];

export function AiChatHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  const session = chatSessions.find((s) => s.id === selectedSession);

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
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">R</div>
            <div>
              <p className="text-sm font-semibold">Rahim Uddin</p>
              <p className="text-xs text-muted-foreground">Seeker Account</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {seekerNavItems.map((n) => (
            <Link
              key={n.label}
              href={n.path as Route}
              onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                n.label === "AI Chat History"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-4xl">
          {selectedSession && session ? (
            /* Conversation View */
            <>
              <button
                onClick={() => setSelectedSession(null)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" /> Back to History
              </button>
              <div className="mb-6">
                <h1 className="text-xl font-bold tracking-tight mb-1">{session.title}</h1>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{session.date} at {session.time}</span>
                  <span>{session.results} results found</span>
                </div>
              </div>

              <div className="space-y-3">
                {session.messages.map((m, i) => {
                  if (m.from === "ai" && m.suggestions) {
                    return (
                      <div key={i} className="max-w-[90%] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3 ring-1 ring-blue-500/20">
                        <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 mb-2">
                          <Sparkles className="w-3 h-3" />
                          AI Suggestions
                        </div>
                        <div className="space-y-2">
                          {m.suggestions.map((s) => (
                            <div key={s.title} className="bg-background/50 rounded-md p-2.5 border border-border/50">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">{s.title}</span>
                                <span className="text-xs font-bold text-primary">{s.price}/mo</span>
                              </div>
                              <Badge className="mt-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] px-1.5 py-0">
                                AI Match {s.match}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] px-3 py-2 ${
                        m.from === "user"
                          ? "bg-primary text-primary-foreground rounded-lg rounded-tr-none"
                          : "bg-muted rounded-lg rounded-tl-none"
                      }`}>
                        {m.from === "ai" && (
                          <div className="flex items-center gap-1.5 text-[10px] text-blue-600 dark:text-blue-400 mb-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            BashaAI
                          </div>
                        )}
                        <p className="text-sm">{m.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <Link href="/search">
                  <Button className="bg-primary hover:bg-primary/90 gap-2">
                    <Sparkles className="w-4 h-4" /> Run This Search Again
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            /* List View */
            <>
              <BackButton />
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> AI Chat History
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Review your previous AI-powered searches</p>
              </div>

              <div className="space-y-3">
                {chatSessions.map((s) => (
                  <div key={s.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{s.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.summary}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.date} &middot; {s.time}</span>
                          <span>{s.results} results</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1 shrink-0 self-end sm:self-center"
                        onClick={() => setSelectedSession(s.id)}
                      >
                        View Results <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
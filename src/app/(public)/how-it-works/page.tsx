"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Home,
  ListChecks,
  MapPinned,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

const seekerSteps = [
  {
    icon: Search,
    title: "Search your area",
    text: "Choose a location, budget, listing type, and facilities.",
  },
  {
    icon: Bot,
    title: "Ask BashaAI",
    text: "Describe what you need in simple English or Bangla.",
  },
  {
    icon: MapPinned,
    title: "Check map and details",
    text: "See nearby listings, rent, amenities, owner info, and location.",
  },
  {
    icon: MessageCircle,
    title: "Contact the lister",
    text: "Start a chat when a listing feels right.",
  },
];

const listerSteps = [
  "Create a lister account",
  "Add rent, location, photos, facilities, and map pin",
  "Manage active and paused listings from dashboard",
  "Reply to seeker inquiries and track analytics",
];

const aiCapabilities = [
  "Find listings from location, budget, tenant type, and facilities",
  "Explain listing details in simple English and Bangla",
  "Show the matching listing card after the answer",
  "Keep answers focused on rental search only",
];

export default function Page() {
  return (
    <div className="bg-background">
      <section className="px-4 md:px-8 lg:px-16 py-12 md:py-16 border-b border-border">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-8 items-center">
          <div>
            <Badge variant="outline" className="mb-4 gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              BashaAI guide
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
              Find, compare, and contact rentals with less confusion.
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl">
              BashaAI helps seekers search by area, budget, facilities, and map location. Listers can publish homes, manage inquiries, and understand performance from one dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <Link href="/search">
                <Button className="bg-primary hover:bg-primary/90">
                  Find Listing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/signup?role=LISTER">
                <Button variant="outline">Post a Listing</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-3 mb-4">
              <div>
                <p className="text-sm font-semibold">Rental flow</p>
                <p className="text-xs text-muted-foreground">Search to conversation</p>
              </div>
              <Badge className="bg-primary/90">Live</Badge>
            </div>
            <div className="space-y-3">
              {[
                ["Location", "Mirpur 10"],
                ["Budget", "৳8,000 - ৳15,000"],
                ["Facilities", "WiFi, Meal, Attached Bathroom"],
                ["Result", "3 matching listings"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-md border border-border bg-background p-3">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-16 py-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">For Seekers</h2>
            <p className="text-sm text-muted-foreground mt-1">A simple path from search to contact.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {seekerSteps.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">Step {index + 1}</span>
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-16 py-12 bg-muted/25 border-y border-border">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">For Listers</h2>
            </div>
            <div className="space-y-3">
              {listerSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                  <div className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">How AI Helps</h2>
            </div>
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {aiCapabilities.map((item) => (
                <div key={item} className="flex items-start gap-3 p-4">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-16 py-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: ListChecks,
              title: "Clear listing details",
              text: "Rent, location, facilities, utility info, photos, and owner details stay organized.",
            },
            {
              icon: MapPinned,
              title: "Map-first discovery",
              text: "Use map pins to understand which listings are close to your preferred area.",
            },
            {
              icon: ShieldCheck,
              title: "Focused rental experience",
              text: "The AI and dashboards are designed around rental search, not unrelated tasks.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card p-5">
              <item.icon className="w-5 h-5 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-16 pb-14">
        <div className="w-full max-w-7xl mx-auto rounded-lg border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start gap-3">
            <UserRound className="w-6 h-6 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-bold tracking-tight">Ready to use BashaAI?</h2>
              <p className="text-sm text-muted-foreground mt-1">Start as a seeker, or post your first listing as a lister.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/search">
              <Button variant="outline">Browse Listings</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90">Create Account</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

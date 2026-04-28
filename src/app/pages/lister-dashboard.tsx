"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  LayoutDashboard, Home, PlusCircle, Inbox, MessageCircle, BarChart2,
  Settings, LogOut, Pencil, Trash2, Pause, Play, Menu, X
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/lister" },
  { icon: Home, label: "My Listings", path: "/lister" },
  { icon: PlusCircle, label: "Add New Listing", path: "/add-listing" },
  { icon: Inbox, label: "Inquiries", path: "/lister" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: BarChart2, label: "Analytics", path: "/lister" },
  { icon: Settings, label: "Account Settings", path: "/settings" },
  { icon: LogOut, label: "Logout", path: "/" },
];

const listings = [
  { title: "Spacious Bachelor Seat", type: "Bachelor Seat", location: "Mirpur-10, Dhaka", price: "৳3,500", status: "Active" as const },
  { title: "Single Room with Balcony", type: "Single Room", location: "Dhanmondi, Dhaka", price: "৳8,000", status: "Under Review" as const },
  { title: "Family Flat 3BR", type: "Family Flat", location: "Uttara, Dhaka", price: "৳15,000", status: "Paused" as const },
];

const inquiries = [
  { name: "Rahim Uddin", avatar: "R", msg: "Is the Mirpur-10 bachelor seat still available? I can visit tomorrow.", time: "10 min ago" },
  { name: "Fatima Rahman", avatar: "F", msg: "Can you share more photos of the Dhanmondi room?", time: "2 hours ago" },
  { name: "Arif Hasan", avatar: "A", msg: "Is the price negotiable for the Uttara flat?", time: "Yesterday" },
];

export function ListerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statusVariant = (s: string) => {
    if (s === "Active") return "default";
    if (s === "Under Review") return "secondary";
    return "outline";
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
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">K</div>
            <div>
              <p className="text-sm font-semibold">Kamal Hossain</p>
              <p className="text-xs text-muted-foreground">Lister Account</p>
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
                n.label === "Dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, Kamal Hossain</h1>
            <p className="text-sm text-muted-foreground">Room Owner / Lister</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Listings", value: "3" },
              { label: "Total Views", value: "248" },
              { label: "Inquiries This Week", value: "12" },
              { label: "Messages Unread", value: "5" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Listings Table */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold tracking-tight mb-4">My Listings</h2>
            <div className="bg-card border border-border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-xs">
                    <th className="text-left p-3 font-medium">Listing Title</th>
                    <th className="text-left p-3 font-medium hidden sm:table-cell">Type</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Location</th>
                    <th className="text-left p-3 font-medium">Price</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-accent/30">
                      <td className="p-3 font-medium">{l.title}</td>
                      <td className="p-3 hidden sm:table-cell text-muted-foreground">{l.type}</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{l.location}</td>
                      <td className="p-3">{l.price}</td>
                      <td className="p-3">
                        <Badge variant={statusVariant(l.status)} className="text-xs">{l.status}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded hover:bg-accent transition-colors" title="Edit">
                            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-accent transition-colors" title={l.status === "Paused" ? "Activate" : "Pause"}>
                            {l.status === "Paused" ? <Play className="w-3.5 h-3.5 text-muted-foreground" /> : <Pause className="w-3.5 h-3.5 text-muted-foreground" />}
                          </button>
                          <button className="p-1.5 rounded hover:bg-destructive/20 transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Add */}
          <div className="mb-8">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <PlusCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-semibold mb-2">Add New Listing</h3>
              <p className="text-sm text-muted-foreground mb-4">Post a new room or house listing</p>
              <Link href="/add-listing">
                <Button className="bg-primary hover:bg-primary/90">Post a Listing</Button>
              </Link>
            </div>
          </div>

          {/* Recent Inquiries */}
          <div>
            <h2 className="text-lg font-semibold tracking-tight mb-4">Recent Inquiries</h2>
            <div className="space-y-3">
              {inquiries.map((q, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">{q.avatar}</div>
                    <div>
                      <p className="text-sm font-medium">{q.name}</p>
                      <p className="text-xs text-muted-foreground">{q.msg}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{q.time}</p>
                    </div>
                  </div>
                  <Link href="/messages">
                    <Button variant="outline" size="sm" className="text-xs shrink-0 self-end sm:self-center">Reply</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
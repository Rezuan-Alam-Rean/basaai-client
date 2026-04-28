"use client";

import { useState } from "react";
import {
  Settings, LogOut, Camera, Save,
  Menu, X, ArrowLeft
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import Link from "next/link";
import { BackButton } from "../components/back-button";

const sidebarItems = [
  { icon: ArrowLeft, label: "Back to Dashboard", link: true },
  { icon: Settings, label: "Account Settings" },
  { icon: LogOut, label: "Logout" },
];

export function AccountSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          {sidebarItems.map((n) => {
            if (n.link) {
              return (
                <Link
                  key={n.label}
                  href="/seeker"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                >
                  <n.icon className="w-4 h-4" />
                  {n.label}
                </Link>
              );
            }
            return (
              <button
                key={n.label}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  n.label === "Account Settings"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <n.icon className="w-4 h-4" />
                {n.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-2xl">
          <BackButton />
          <h1 className="text-2xl font-bold tracking-tight mb-1">Account Settings</h1>
          <p className="text-sm text-muted-foreground mb-8">Manage your profile and account preferences</p>

          {/* Profile Picture */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Profile Picture</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                  R
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium">Upload a new photo</p>
                <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 5MB.</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
                  <Input defaultValue="Rahim Uddin" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Mobile Number</label>
                  <Input defaultValue="+880 1712-345678" />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                <Input defaultValue="rahim.uddin@email.com" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Address</label>
                <Input defaultValue="Farmgate, Dhaka-1215" />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Social Media Links</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Facebook</label>
                <Input placeholder="https://facebook.com/yourprofile" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">LinkedIn</label>
                <Input placeholder="https://linkedin.com/in/yourprofile" />
              </div>
            </div>
          </div>

          {/* Connected Account */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Connected Accounts</h2>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <div>
                    <p className="text-sm font-medium">Google Account</p>
                    <p className="text-xs text-muted-foreground">rahim.uddin@gmail.com</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs text-green-600 dark:text-green-400">Connected</Badge>
              </div>
            </div>
          </div>

          {/* Save */}
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      </main>
    </div>
  );
}
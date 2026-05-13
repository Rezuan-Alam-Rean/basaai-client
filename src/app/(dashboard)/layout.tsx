"use client";

import type { ReactNode } from "react";
import { Navbar } from "../components/navbar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";

  // Pages under these paths render their own sidebar/full layout — don't constrain/center them
  const fullLayoutPrefixes = [
    "/lister",
    "/seeker",
    "/messages",
    "/chat",
    "/settings",
    "/add-listing",
    "/edit-listing",
    "/ai-history",
    "/saved-listings",
  ];
  const useFullWidth = fullLayoutPrefixes.some((p) => pathname.startsWith(p));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {useFullWidth ? (
          children
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8">{children}</div>
        )}
      </main>
    </div>
  );
}
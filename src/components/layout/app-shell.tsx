"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "@/app/components/footer";

const FloatingChatbot = dynamic(
  () => import("@/app/components/floating-chatbot").then((m) => m.FloatingChatbot),
  { ssr: false },
);

const NO_FOOTER_PREFIXES = [
  "/map",
  "/seeker",
  "/lister",
  "/messages",
  "/settings",
  "/add-listing",
  "/ai-history",
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const showFooter = !NO_FOOTER_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      {showFooter && <Footer />}
      <FloatingChatbot />
    </div>
  );
}

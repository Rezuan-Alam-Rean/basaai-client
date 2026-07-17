"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { FloatingChatbot } from "./floating-chatbot";

const noFooterPages = ["/map", "/seeker", "/lister", "/messages", "/chat", "/settings", "/add-listing", "/ai-history"];

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showFooter = !noFooterPages.some((page) => pathname.startsWith(page));
  const showFloatingChat = pathname !== "/";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      {showFooter ? <Footer /> : null}
      {showFloatingChat ? <FloatingChatbot /> : null}
    </div>
  );
}

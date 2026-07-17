"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ListingCard } from "./listing-card";
import { useAppSelector } from "../redux/hooks";
import { useAiChat } from "./use-ai-chat";

const quickPrompts = [
  "Find rooms near me",
  "Bachelor seats under ৳4,000",
  "Rooms with WiFi in Dhanmondi",
];

export function FloatingChatbot() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = Boolean(user);
  const [open, setOpen] = useState(false);
  const {
    chatInput,
    setChatInput,
    messages,
    isTyping,
    listingPageByMsg,
    setListingPageByMsg,
    handleSend,
  } = useAiChat(isAuthenticated);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const listingsPerPage = 3;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  return (
    <div className="floating-chatbot-root">
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 transition-all duration-200 group"
          aria-label="Open AI Chat"
        >
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background" />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-120px)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">BashaAI Assistant</p>
                <p className="text-[10px] text-green-500">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md hover:bg-accent transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 ${
                    m.from === "user"
                      ? "bg-primary text-primary-foreground rounded-lg rounded-tr-none"
                      : "bg-muted rounded-lg rounded-tl-none"
                  }`}
                >
                  {m.from === "ai" && (
                    <div className="flex items-center gap-1.5 text-[10px] text-blue-600 dark:text-blue-400 mb-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      BashaAI
                    </div>
                  )}
                  <p className="text-sm">{m.text}</p>
                  {m.from === "ai" && m.listings && m.listings.length > 0 && (() => {
                    const currentPage = listingPageByMsg[m.id] ?? 1;
                    const totalPages = Math.ceil(m.listings.length / listingsPerPage);
                    const startIndex = (currentPage - 1) * listingsPerPage;
                    const pageListings = m.listings.slice(startIndex, startIndex + listingsPerPage);

                    return (
                      <div className="mt-2">
                        <div className="grid gap-2">
                          {pageListings.map((l) => (
                            <div key={l.id} className="bg-background/60 rounded-lg border border-border/60 p-1">
                              <ListingCard listing={l} chatCompact />
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
                  <p className={`text-[10px] mt-1 ${m.from === "user" ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg rounded-tl-none px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                        style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask BashaAI anything..."
                className="flex-1 rounded-full bg-muted border-border text-sm"
                disabled={!isAuthenticated}
              />
              <button
                onClick={() => handleSend()}
                className="w-9 h-9 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
                disabled={!isAuthenticated}
              >
                <Send className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
            {!isAuthenticated && (
              <div className="mt-2 text-[11px] text-muted-foreground">
                Please log in to use BashaAI chat.
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        body.hide-floating-chat .floating-chatbot-root {
          display: none;
        }

        body.floating-chat-left .floating-chatbot-root > button,
        body.floating-chat-left .floating-chatbot-root > div {
          right: auto;
          left: 1.5rem;
        }

        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

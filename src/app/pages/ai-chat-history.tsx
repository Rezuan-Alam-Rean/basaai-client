import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Bookmark,
  MessageCircle,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Clock,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { BackButton } from "../components/back-button";
import { useAppSelector } from "../redux/hooks";
import { useGetAiHistoryQuery } from "../redux/features/ai/aiApi";

const seekerNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/seeker" },
  { icon: Bookmark, label: "Saved Listings", path: "/seeker" },
  { icon: MessageCircle, label: "My Chats", path: "/messages" },
  { icon: Sparkles, label: "AI Chat History", path: "/ai-history" },
  { icon: Settings, label: "Account Settings", path: "/settings" },
  { icon: LogOut, label: "Logout", path: "/" },
];

type HistoryListing = {
  id: string;
  title: string;
  price: number;
  location: string;
  images?: string[];
  owner?: { id: string; name: string } | null;
};

type HistoryMessage = {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  createdAt: string;
  listings?: HistoryListing[];
};

type HistorySession = {
  id: string;
  title: string;
  summary: string;
  dateLabel: string;
  timeLabel: string;
  results: number;
  messages: HistoryMessage[];
  lastUpdated: number;
};

function formatDateLabel(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function formatTimeLabel(value: string) {
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function truncate(value: string, maxLength = 64) {
  const trimmed = value.trim();
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength)}...` : trimmed;
}

function buildSessions(messages: HistoryMessage[]): HistorySession[] {
  if (messages.length === 0) return [];

  const grouped: HistorySession[] = [];
  let current: HistorySession | null = null;

  for (const row of messages) {
    if (row.role === "USER") {
      if (current) grouped.push(current);

      const messageText = row.content || "AI Search";
      const time = new Date(row.createdAt).getTime();

      current = {
        id: row.id,
        title: truncate(messageText),
        summary: truncate(messageText),
        dateLabel: formatDateLabel(row.createdAt),
        timeLabel: formatTimeLabel(row.createdAt),
        results: 0,
        messages: [row],
        lastUpdated: time,
      };
      continue;
    }

    if (!current) {
      const time = new Date(row.createdAt).getTime();
      current = {
        id: row.id,
        title: "AI Search",
        summary: row.content || "AI response",
        dateLabel: formatDateLabel(row.createdAt),
        timeLabel: formatTimeLabel(row.createdAt),
        results: 0,
        messages: [row],
        lastUpdated: time,
      };
      continue;
    }

    current.messages.push(row);
    current.lastUpdated = Math.max(current.lastUpdated, new Date(row.createdAt).getTime());

    if (row.role === "ASSISTANT") {
      current.summary = row.content ? truncate(row.content) : current.summary;
      const listingCount = (row.listings || []).length;
      current.results = Math.max(current.results, listingCount);
    }
  }

  if (current) grouped.push(current);

  return grouped
    .map((session) => {
      const uniqueListingIds = new Set<string>();
      session.messages.forEach((message) => {
        message.listings?.forEach((listing) => uniqueListingIds.add(listing.id));
      });

      return {
        ...session,
        results: Math.max(session.results, uniqueListingIds.size),
      };
    })
    .sort((a, b) => b.lastUpdated - a.lastUpdated);
}

export function AiChatHistoryPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const { data: historyData, isLoading } = useGetAiHistoryQuery();

  const sessions = useMemo(() => {
    const messages = Array.isArray(historyData?.messages) ? (historyData.messages as HistoryMessage[]) : [];
    return buildSessions(messages);
  }, [historyData]);

  const session = sessions.find((item) => item.id === selectedSessionId) || null;

  const displayName = user?.name || "Guest User";
  const displayRole = user?.role === "LISTER" ? "Lister Account" : "Seeker Account";
  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || "U";

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
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">{avatarLetter}</div>
            <div>
              <p className="text-sm font-semibold truncate max-w-[140px]">{displayName}</p>
              <p className="text-xs text-muted-foreground">{displayRole}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {seekerNavItems.map((n) => (
            <Link
              key={n.label}
              href={n.path}
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

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex justify-center">
        <div className="w-full max-w-5xl mx-auto">
          {isLoading ? (
            <div className="min-h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
              Loading AI history...
            </div>
          ) : session ? (
            <>
              <button
                onClick={() => setSelectedSessionId(null)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" /> Back to History
              </button>

              <div className="mb-6">
                <h1 className="text-xl font-bold tracking-tight mb-1">{session.title}</h1>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {session.dateLabel} at {session.timeLabel}
                  </span>
                  <span>{session.results} results found</span>
                </div>
              </div>

              <div className="space-y-3">
                {session.messages.map((message) => {
                  if (message.role === "ASSISTANT" && message.listings && message.listings.length > 0) {
                    return (
                      <div key={message.id} className="max-w-[90%] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3 ring-1 ring-blue-500/20">
                        <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 mb-2">
                          <Sparkles className="w-3 h-3" />
                          AI Suggestions
                        </div>
                        <div className="space-y-2">
                          {message.listings.map((listing) => (
                            <div key={listing.id} className="rounded-md p-2.5 border border-border/50">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-xs font-medium truncate">{listing.title}</span>
                                <span className="text-xs font-bold text-primary shrink-0">৳{listing.price.toLocaleString()}/mo</span>
                              </div>
                              <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{listing.location}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={message.id} className={`flex ${message.role === "USER" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] px-3 py-2 ${
                        message.role === "USER"
                          ? "bg-primary text-primary-foreground rounded-lg rounded-tr-none"
                          : "bg-muted rounded-lg rounded-tl-none"
                      }`}>
                        {message.role === "ASSISTANT" && (
                          <div className="flex items-center gap-1.5 text-[10px] text-blue-600 dark:text-blue-400 mb-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            BashaAI
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <Link href="/#live-ai-chat">
                  <Button className="bg-primary hover:bg-primary/90 gap-2">
                    <Sparkles className="w-4 h-4" /> Run This Search Again
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <BackButton />
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> AI Chat History
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Review your previous AI-powered searches</p>
              </div>

              <div className="space-y-3">
                {sessions.slice(0, 8).length === 0 ? (
                  <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                    No AI chat history yet.
                  </div>
                ) : (
                  sessions.slice(0, 8).map((item) => (
                    <div key={item.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.summary}</p>
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.dateLabel} &middot; {item.timeLabel}</span>
                            <span>{item.results} results</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1 shrink-0 self-end sm:self-center"
                          onClick={() => setSelectedSessionId(item.id)}
                        >
                          View Results <ChevronRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
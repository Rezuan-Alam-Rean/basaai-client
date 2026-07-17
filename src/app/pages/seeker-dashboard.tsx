import { useMemo, useState } from "react";
import {
  LayoutDashboard, Bookmark, MessageCircle, Sparkles, Settings, LogOut,
  Menu, X, Clock, ChevronRight, MapPin
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/features/auth/authSlice";
import { useGetSavedListingsQuery } from "../redux/features/listing/listingApi";
import { useGetConversationsQuery } from "../redux/features/chat/messagingApi";
import { useGetAiHistoryQuery } from "../redux/features/ai/aiApi";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/seeker" },
  { icon: Bookmark, label: "Saved Listings", path: "/saved-listings" },
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
        lastUpdated: time,
      };
      continue;
    }

    current.lastUpdated = Math.max(current.lastUpdated, new Date(row.createdAt).getTime());

    if (row.role === "ASSISTANT") {
      current.summary = row.content ? truncate(row.content) : current.summary;
      current.results = Math.max(current.results, (row.listings || []).length);
    }
  }

  if (current) grouped.push(current);

  return grouped.sort((a, b) => b.lastUpdated - a.lastUpdated).slice(0, 3);
}

export function SeekerDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";
  
  // Dynamic data
  const { data: savedData } = useGetSavedListingsQuery();
  const { data: chatsData } = useGetConversationsQuery();
  const { data: aiHistoryData } = useGetAiHistoryQuery();
  const aiSessions = useMemo(() => {
    const messages = Array.isArray(aiHistoryData?.messages) ? (aiHistoryData.messages as HistoryMessage[]) : [];
    return buildSessions(messages);
  }, [aiHistoryData]);
  
  const savedCount = (savedData?.listings || []).length;
  const chatsCount = (chatsData?.conversations || []).length;
  const aiSearchCount = (aiHistoryData?.sessions || []).length;
  const recentSavedListings = (savedData?.listings || []).slice(0, 3);
  const statCards = [
    { label: "Saved Listings", value: String(savedCount) },
    { label: "Active Chats", value: String(chatsCount) },
    { label: "AI Searches", value: String(aiSearchCount) },
  ].filter((card) => Number(card.value) > 0);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed bottom-6 left-4 z-30 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-20 w-64 h-full bg-card border-r border-border flex flex-col transition-transform`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">{initials}</div>
            <div>
              <p className="text-sm font-semibold truncate max-w-[140px]">{user?.name || "Guest User"}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()} Account</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((n) => (
            <Link
              key={n.label}
              href={n.path}
              onClick={() => { 
                setSidebarOpen(false); 
                if (n.label === "Logout") handleLogout();
              }}
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

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="w-full">
          {/* Greeting */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Good morning, {user?.name?.split(" ")[0] || "there"} <span role="img">👋</span></h1>
            <p className="text-sm text-muted-foreground">Explore and save your favorite listings</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {statCards.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          {/* AI Search History */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> AI Search History
              </h2>
              <Link href="/ai-history">
                <Button variant="outline" size="sm">All</Button>
              </Link>
            </div>
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {aiSessions.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">No AI search history yet.</div>
              ) : (
                aiSessions.map((session) => (
                  <div key={session.id} className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm truncate">{session.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.dateLabel} at {session.timeLabel}
                        </span>
                        <span>{session.results} results</span>
                      </p>
                    </div>
                    <Link href="/ai-history">
                      <Button variant="ghost" size="sm" className="text-primary text-xs gap-1">
                        View Results <ChevronRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* My Recent Saved Listings */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-1">
              <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-primary" /> My Recent Saved Listings
              </h2>
              <Link href="/saved-listings">
                <Button variant="outline" size="sm">All</Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Your latest saved listings are shown here</p>
            {recentSavedListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {recentSavedListings.map((listing: any) => (
                  <div key={listing.id} className="bg-card border border-border rounded-lg p-4 flex gap-3">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted shrink-0">
                      {listing.images?.[0] ? (
                        <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No photo</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium line-clamp-2">{listing.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{listing.location}</span>
                      </p>
                      <p className="text-sm font-semibold text-primary mt-2">৳{listing.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

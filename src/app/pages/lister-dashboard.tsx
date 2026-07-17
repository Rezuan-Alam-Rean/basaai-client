import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Home, PlusCircle, Inbox, MessageCircle, BarChart2,
  Settings, LogOut, Pencil, Trash2, Pause, Play, Menu, X, Loader2,
  TrendingUp, Wallet, Activity, MapPinned, Users, Clock, UserRoundCheck
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/features/auth/authSlice";
import { 
  useGetMyListingsQuery, 
  useToggleListingMutation, 
  useDeleteListingMutation 
} from "../redux/features/listing/listingApi";
import { useGetConversationsQuery } from "../redux/features/chat/messagingApi";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/lister" },
  { icon: Home, label: "My Listings", path: "/lister?tab=My%20Listings" },
  { icon: PlusCircle, label: "Add New Listing", path: "/add-listing" },
  { icon: Inbox, label: "Inquiries", path: "/lister?tab=Inquiries" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: BarChart2, label: "Analytics", path: "/lister?tab=Analytics" },
  { icon: Settings, label: "Account Settings", path: "/settings" },
  { icon: LogOut, label: "Logout", path: "/" },
];

const listerDashboardTabs = ["Dashboard", "My Listings", "Inquiries", "Analytics"];

interface Listing {
  id: string;
  title: string;
  propertyType: string | null;
  location: string;
  city?: string | null;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  bedrooms?: number | null;
  availableSeats?: number | null;
  amenities?: string[];
}

interface ConversationSummary {
  id: string;
  otherUser: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    role?: string | null;
  };
  lastMessageText?: string | null;
  lastMessageAt?: string | null;
  unreadCount: number;
}

const chartColors = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function formatCurrency(value: number) {
  return `৳${Math.round(value).toLocaleString()}`;
}

function shortMonth(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short" });
}

function getMonthWindow(months = 6) {
  const now = new Date();
  return Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: shortMonth(date),
      date,
    };
  });
}

function countBy<T>(items: T[], getKey: (item: T) => string | null | undefined) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = getKey(item)?.trim() || "Not specified";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function toRankedData(source: Record<string, number>, limit = 6) {
  return Object.entries(source)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function ListerDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading: loadingListings } = useGetMyListingsQuery();
  const listings = data?.listings || [];

  const [toggleListing] = useToggleListingMutation();
  const [deleteListing] = useDeleteListingMutation();
  
  // Get conversations for message count
  const { data: chatsData } = useGetConversationsQuery();
  const conversations = (chatsData?.conversations || []) as ConversationSummary[];
  const inquiryStats = useMemo(() => {
    const sorted = [...conversations].sort(
      (a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime()
    );
    const unread = sorted.reduce((sum, item) => sum + (item.unreadCount || 0), 0);
    const today = sorted.filter((item) => {
      if (!item.lastMessageAt) return false;
      const value = new Date(item.lastMessageAt);
      const now = new Date();
      return value.toDateString() === now.toDateString();
    }).length;

    return {
      sorted,
      unread,
      today,
      replied: Math.max(0, sorted.length - sorted.filter((item) => item.unreadCount > 0).length),
    };
  }, [conversations]);
  const analytics = useMemo(() => {
    const typedListings = listings as Listing[];
    const activeListings = typedListings.filter((l) => l.isAvailable);
    const pausedListings = typedListings.length - activeListings.length;
    const totalRent = typedListings.reduce((sum, l) => sum + Number(l.price || 0), 0);
    const averageRent = typedListings.length ? totalRent / typedListings.length : 0;
    const highestRent = typedListings.reduce((max, l) => Math.max(max, Number(l.price || 0)), 0);
    const lowestRent = typedListings.length
      ? typedListings.reduce((min, l) => Math.min(min, Number(l.price || 0)), Number(typedListings[0]?.price || 0))
      : 0;
    const unreadMessages = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

    const months = getMonthWindow(6);
    const monthlyData = months.map((month) => {
      const monthListings = typedListings.filter((listing) => {
        const date = new Date(listing.createdAt);
        return `${date.getFullYear()}-${date.getMonth()}` === month.key;
      });
      const monthRent = monthListings.reduce((sum, listing) => sum + Number(listing.price || 0), 0);
      return {
        month: month.month,
        listings: monthListings.length,
        averageRent: monthListings.length ? Math.round(monthRent / monthListings.length) : 0,
      };
    });

    const statusData = [
      { name: "Active", value: activeListings.length },
      { name: "Paused", value: pausedListings },
    ].filter((item) => item.value > 0);

    const propertyTypeData = toRankedData(countBy(typedListings, (l) => l.propertyType), 6);
    const locationData = toRankedData(countBy(typedListings, (l) => l.city || l.location), 5);
    const amenityData = toRankedData(
      typedListings.reduce<Record<string, number>>((acc, listing) => {
        (listing.amenities || []).forEach((amenity) => {
          acc[amenity] = (acc[amenity] || 0) + 1;
        });
        return acc;
      }, {}),
      6
    );

    const priceBands = [
      { name: "Under 5k", value: typedListings.filter((l) => l.price < 5000).length },
      { name: "5k-10k", value: typedListings.filter((l) => l.price >= 5000 && l.price < 10000).length },
      { name: "10k-20k", value: typedListings.filter((l) => l.price >= 10000 && l.price < 20000).length },
      { name: "20k+", value: typedListings.filter((l) => l.price >= 20000).length },
    ];

    const seatCapacity = typedListings.reduce((sum, l) => sum + Number(l.availableSeats || 0), 0);
    const conversationRate = typedListings.length ? Math.round((conversations.length / typedListings.length) * 100) : 0;

    return {
      activeListings: activeListings.length,
      pausedListings,
      totalListings: typedListings.length,
      averageRent,
      highestRent,
      lowestRent,
      unreadMessages,
      seatCapacity,
      conversationRate,
      monthlyData,
      statusData,
      propertyTypeData,
      locationData,
      amenityData,
      priceBands,
    };
  }, [listings, conversations]);

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && listerDashboardTabs.includes(tab)) {
      setActiveNav(tab);
    } else if (!tab) {
      setActiveNav("Dashboard");
    }
  }, [searchParams]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await toggleListing(id).unwrap();
      toast.success(res.listing.isAvailable ? "Listing activated" : "Listing paused");
    } catch { toast.error("Failed to toggle listing"); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteListing(id).unwrap();
      toast.success("Listing deleted");
    } catch { toast.error("Failed to delete listing"); }
  };

  const statusLabel = (l: Listing) => l.isAvailable ? "Active" : "Paused";
  const statusVariant = (s: string) => {
    if (s === "Active") return "default";
    if (s === "Under Review") return "secondary";
    return "outline";
  };

  const statCards = [
    { label: "Active Listings", value: String(analytics.activeListings) },
    { label: "Total Listings", value: String(analytics.totalListings) },
    { label: "Active Conversations", value: String(conversations.length) },
    { label: "Unread Messages", value: String(analytics.unreadMessages) },
  ].filter((card) => Number(card.value) > 0);

  // Which listings to show based on active nav
  const displayListings = activeNav === "My Listings" ? listings : listings.slice(0, 3);

  const renderListingsTable = (items: Listing[]) => (
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
          {items.map((l) => {
            const status = statusLabel(l);
            return (
              <tr key={l.id} className="border-b border-border/50 last:border-0 hover:bg-accent/30">
                <td className="p-3 font-medium"><Link href={`/listing/${l.id}`} className="hover:text-primary hover:underline">{l.title}</Link></td>
                <td className="p-3 hidden sm:table-cell text-muted-foreground">{l.propertyType || "—"}</td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{l.location}</td>
                <td className="p-3">৳{l.price.toLocaleString()}</td>
                <td className="p-3">
                  <Badge variant={statusVariant(status)} className="text-xs">{status}</Badge>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Edit" onClick={() => router.push(`/edit-listing/${l.id}`)}>
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-accent transition-colors" title={status === "Paused" ? "Activate" : "Pause"} onClick={() => handleToggle(l.id)}>
                      {status === "Paused" ? <Play className="w-3.5 h-3.5 text-muted-foreground" /> : <Pause className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                    <button className="p-1.5 rounded hover:bg-destructive/20 transition-colors" title="Delete" onClick={() => handleDelete(l.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {items.length === 0 && !loadingListings && (
        <p className="text-sm text-muted-foreground text-center py-8">No listings yet.</p>
      )}
      {loadingListings && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );

  const renderEmptyChart = (label: string) => (
    <div className="h-[260px] flex items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
      {label}
    </div>
  );

  const renderInquiries = () => {
    const inquiryCards = [
      { label: "Total Inquiries", value: conversations.length, icon: Inbox, note: "All seeker conversations" },
      { label: "Unread Messages", value: inquiryStats.unread, icon: MessageCircle, note: "Need your attention" },
      { label: "Today", value: inquiryStats.today, icon: Clock, note: "New activity today" },
      { label: "Handled Threads", value: inquiryStats.replied, icon: UserRoundCheck, note: "No unread messages" },
    ];

    return (
      <>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inquiries</h1>
            <p className="text-sm text-muted-foreground">Track seeker interest and reply to recent rental questions.</p>
          </div>
          <Link href="/messages">
            <Button className="bg-primary hover:bg-primary/90">
              <MessageCircle className="w-4 h-4 mr-2" />
              Open Messages
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {inquiryCards.map((card) => (
            <div key={card.label} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <card.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{card.note}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Recent Inquiry Threads</h2>
                <p className="text-xs text-muted-foreground">Latest seeker conversations from your listings</p>
              </div>
              {inquiryStats.unread > 0 && (
                <Badge className="bg-primary/90">{inquiryStats.unread} unread</Badge>
              )}
            </div>

            {inquiryStats.sorted.length === 0 ? (
              <div className="p-10 text-center">
                <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium mb-1">No inquiries yet</p>
                <p className="text-sm text-muted-foreground">When seekers message you, their inquiries will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {inquiryStats.sorted.map((item) => {
                  const avatar = item.otherUser.name?.trim().charAt(0).toUpperCase() || "U";
                  const time = item.lastMessageAt ? new Date(item.lastMessageAt).toLocaleString() : "No recent message";
                  return (
                    <div key={item.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-accent/20 transition-colors">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
                          {avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium">{item.otherUser.name}</p>
                            {item.unreadCount > 0 ? (
                              <Badge variant="secondary" className="text-[10px] text-primary">
                                {item.unreadCount} new
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px]">Seen</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {item.lastMessageText || "New inquiry"}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-2">{time}</p>
                        </div>
                      </div>
                      <Link href="/messages" className="self-end lg:self-center">
                        <Button variant={item.unreadCount > 0 ? "default" : "outline"} size="sm" className="text-xs">
                          Reply
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-base font-semibold mb-3">Response Focus</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Unread workload</span>
                    <span>{inquiryStats.unread}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, inquiryStats.unread * 20)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Handled threads</span>
                    <span>{inquiryStats.replied}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${conversations.length ? (inquiryStats.replied / conversations.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-base font-semibold mb-2">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/messages">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Reply to seekers
                  </Button>
                </Link>
                <Link href="/lister">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveNav("My Listings")}>
                    <Home className="w-4 h-4 mr-2" />
                    Review listings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderAnalytics = () => {
    const metricCards = [
      {
        label: "Portfolio Rent",
        value: formatCurrency(analytics.averageRent),
        note: "Average monthly rent",
        icon: Wallet,
      },
      {
        label: "Active Ratio",
        value: analytics.totalListings ? `${Math.round((analytics.activeListings / analytics.totalListings) * 100)}%` : "0%",
        note: `${analytics.activeListings} active, ${analytics.pausedListings} paused`,
        icon: Activity,
      },
      {
        label: "Conversation Rate",
        value: `${analytics.conversationRate}%`,
        note: `${conversations.length} conversations from ${analytics.totalListings} listings`,
        icon: MessageCircle,
      },
      {
        label: "Seat Capacity",
        value: String(analytics.seatCapacity),
        note: "Available seats across listings",
        icon: Users,
      },
    ];

    return (
      <>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground">Performance overview based on your listings and inquiries.</p>
          </div>
          <Badge variant="outline" className="w-fit">
            {analytics.totalListings} listing{analytics.totalListings !== 1 ? "s" : ""} tracked
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {metricCards.map((card) => (
            <div key={card.label} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <card.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{card.note}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
          <div className="xl:col-span-2 bg-card border border-border rounded-lg p-4">
            <div className="mb-4">
              <h2 className="text-base font-semibold">Listings Added</h2>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.monthlyData}>
                  <defs>
                    <linearGradient id="listingGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="listings" stroke="#2563eb" fill="url(#listingGrowth)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="mb-4">
              <h2 className="text-base font-semibold">Status Split</h2>
              <p className="text-xs text-muted-foreground">Active vs paused listings</p>
            </div>
            {analytics.statusData.length > 0 ? (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.statusData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={4}>
                      {analytics.statusData.map((entry, index) => (
                        <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 text-xs">
                  {analytics.statusData.map((item, index) => (
                    <span key={item.name} className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                      {item.name}: {item.value}
                    </span>
                  ))}
                </div>
              </div>
            ) : renderEmptyChart("No status data yet")}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="mb-4">
              <h2 className="text-base font-semibold">Rent Trend</h2>
              <p className="text-xs text-muted-foreground">Average rent by listing month</p>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line type="monotone" dataKey="averageRent" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="mb-4">
              <h2 className="text-base font-semibold">Price Bands</h2>
              <p className="text-xs text-muted-foreground">Listings grouped by monthly rent</p>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.priceBands}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <div>
                <h2 className="text-base font-semibold">Property Type Comparison</h2>
                <p className="text-xs text-muted-foreground">Which type you list most</p>
              </div>
            </div>
            {analytics.propertyTypeData.length > 0 ? (
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.propertyTypeData} layout="vertical" margin={{ left: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : renderEmptyChart("No property type data yet")}
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="mb-4 flex items-center gap-2">
              <MapPinned className="w-4 h-4 text-primary" />
              <div>
                <h2 className="text-base font-semibold">Top Locations</h2>
                <p className="text-xs text-muted-foreground">Listing concentration by area</p>
              </div>
            </div>
            {analytics.locationData.length > 0 ? (
              <div className="space-y-3">
                {analytics.locationData.map((item) => {
                  const max = Math.max(...analytics.locationData.map((l) => l.value), 1);
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground">{item.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(item.value / max) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : renderEmptyChart("No location data yet")}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="mb-4">
            <h2 className="text-base font-semibold">Amenity Coverage</h2>
            <p className="text-xs text-muted-foreground">Most common facilities across your listings</p>
          </div>
          {analytics.amenityData.length > 0 ? (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.amenityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : renderEmptyChart("No amenity data yet")}
        </div>
      </>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <button
        className="lg:hidden fixed bottom-6 left-4 z-30 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

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
                if (["Dashboard", "My Listings", "Inquiries", "Analytics"].includes(n.label)) {
                  setActiveNav(n.label);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                n.label === activeNav ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="w-full">
          {activeNav === "Analytics" ? (
            renderAnalytics()
          ) : activeNav === "Inquiries" ? (
            renderInquiries()
          ) : activeNav === "My Listings" ? (
            /* ─── My Listings View ─── */
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">My Listings</h1>
                <p className="text-sm text-muted-foreground">{listings.length} listing{listings.length !== 1 ? "s" : ""} total</p>
              </div>
              {renderListingsTable(displayListings)}
            </>
          ) : (
            /* ─── Dashboard View ─── */
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name || "Kamal Hossain"}</h1>
                <p className="text-sm text-muted-foreground">Room Owner / Lister</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((s) => (
                  <div key={s.label} className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Listings Table — first 3 */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold tracking-tight mb-4">My Listings</h2>
                {renderListingsTable(displayListings)}
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

              {conversations.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold tracking-tight mb-4">Recent Inquiries</h2>
                  <div className="space-y-3">
                    {conversations.slice(0, 3).map((q) => {
                      const avatar = q.otherUser.name?.trim().charAt(0).toUpperCase() || "U";
                      return (
                        <div key={q.id} className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">{avatar}</div>
                            <div>
                              <p className="text-sm font-medium">{q.otherUser.name}</p>
                              <p className="text-xs text-muted-foreground">{q.lastMessageText || "New inquiry"}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{q.lastMessageAt ? new Date(q.lastMessageAt).toLocaleString() : ""}</p>
                            </div>
                          </div>
                          <Link href="/messages">
                            <Button variant="outline" size="sm" className="text-xs shrink-0 self-end sm:self-center">Reply</Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

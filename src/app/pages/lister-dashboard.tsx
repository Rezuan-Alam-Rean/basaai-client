import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Home, PlusCircle, Inbox, MessageCircle, BarChart2,
  Settings, LogOut, Pencil, Trash2, Pause, Play, Menu, X, Loader2
} from "lucide-react";
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
  { icon: Home, label: "My Listings", path: "/lister" },
  { icon: PlusCircle, label: "Add New Listing", path: "/add-listing" },
  { icon: Inbox, label: "Inquiries", path: "/lister" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: BarChart2, label: "Analytics", path: "/lister" },
  { icon: Settings, label: "Account Settings", path: "/settings" },
  { icon: LogOut, label: "Logout", path: "/" },
];

interface Listing {
  id: string;
  title: string;
  propertyType: string | null;
  location: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
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

export function ListerDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data, isLoading: loadingListings } = useGetMyListingsQuery();
  const listings = data?.listings || [];

  const [toggleListing] = useToggleListingMutation();
  const [deleteListing] = useDeleteListingMutation();
  
  // Get conversations for message count
  const { data: chatsData } = useGetConversationsQuery();
  const conversations = (chatsData?.conversations || []) as ConversationSummary[];

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";

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
    { label: "Active Listings", value: String(listings.filter((l: Listing) => l.isAvailable).length) },
    { label: "Total Listings", value: String(listings.length) },
    { label: "Active Conversations", value: String(conversations.length) },
    { label: "Total Views", value: "342" },
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
                if (n.label === "Dashboard" || n.label === "My Listings") setActiveNav(n.label);
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

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {activeNav === "My Listings" ? (
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
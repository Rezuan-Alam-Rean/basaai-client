import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard, Settings, LogOut, Camera, Save,
  Menu, X, ArrowLeft
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BackButton } from "../components/back-button";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/features/auth/authSlice";
import { useGetMeQuery } from "../redux/features/auth/authApi";
import { useUpdateUserMutation } from "../redux/features/user/userApi";

const sidebarItems = [
  { icon: ArrowLeft, label: "Back to Dashboard", link: true },
  { icon: Settings, label: "Account Settings" },
  { icon: LogOut, label: "Logout" },
];

export function AccountSettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    facebookUrl: "",
    linkedinUrl: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { refetch } = useGetMeQuery();
  const [updateUser, { isLoading: saving, error: saveError }] = useUpdateUserMutation();

  const dashboardPath = useMemo(() => {
    if (user?.role === "LISTER") return "/lister";
    return "/seeker";
  }, [user?.role]);

  const displayName = user?.name || "User";
  const displayRole = user?.role === "LISTER" ? "Lister Account" : "Seeker Account";
  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || "U";

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        facebookUrl: user.facebookUrl || "",
        linkedinUrl: user.linkedinUrl || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile]);

  const handleSave = async () => {
    if (!user) return;
    setSaveSuccess(null);

    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("phone", formData.phone.trim());
      payload.append("address", formData.address.trim());
      payload.append("facebookUrl", formData.facebookUrl.trim());
      payload.append("linkedinUrl", formData.linkedinUrl.trim());
      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }

      await updateUser({ id: user.id, body: payload }).unwrap();
      setSaveSuccess("Profile updated.");
      refetch();
    } catch (error: any) {
      // Error handled by mutation state
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
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
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                avatarLetter
              )}
            </div>
            <div>
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-xs text-muted-foreground">{displayRole}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((n) => {
            if (n.link) {
              return (
                <Link
                  key={n.label}
                  href={dashboardPath}
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
                onClick={() => {
                  if (n.label === "Logout") {
                    handleLogout();
                  }
                }}
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
        <div className="max-w-2xl mx-auto">
          <BackButton />
          <h1 className="text-2xl font-bold tracking-tight mb-1">Account Settings</h1>
          <p className="text-sm text-muted-foreground mb-8">Manage your profile and account preferences</p>

          {/* Profile Picture */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Profile Picture</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    avatarLetter
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                >
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
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Mobile Number</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                <Input value={user?.email || ""} disabled />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Social Media Links</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Facebook</label>
                <Input
                  placeholder="https://facebook.com/yourprofile"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, facebookUrl: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">LinkedIn</label>
                <Input
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3">
            <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={handleSave} disabled={saving || !user}>
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
            </Button>
            {saveSuccess && <span className="text-xs text-green-600 dark:text-green-400">{saveSuccess}</span>}
            {saveError && (
              <span className="text-xs text-red-600 dark:text-red-400">
                {(saveError as any)?.data?.message || "Failed to update profile."}
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
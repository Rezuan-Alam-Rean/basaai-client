import { useState } from "react";
import {
  LayoutDashboard, Home, PlusCircle, Inbox, MessageCircle, BarChart2,
  Settings, LogOut, Menu, X, Upload, ChevronDown, ChevronRight, MapPin, Car, Loader2, LocateFixed
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BackButton } from "../components/back-button";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/features/auth/authSlice";
import { useAddListingMutation } from "../redux/features/listing/listingApi";
import { toast } from "sonner";

const listerNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/lister" },
  { icon: Home, label: "My Listings", path: "/lister" },
  { icon: PlusCircle, label: "Add New Listing", path: "/add-listing" },
  { icon: Inbox, label: "Inquiries", path: "/lister" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: BarChart2, label: "Analytics", path: "/lister" },
  { icon: Settings, label: "Account Settings", path: "/settings" },
  { icon: LogOut, label: "Logout", path: "/" },
];

// Exact mirror of search filter structure
const facilityOptions = ["WiFi Available", "Meal Facility", "No Smokers", "Attached Bathroom", "Rooftop Access"];
const listingTypeOptions = ["Bachelor Seat", "Single Room", "Family Flat", "Sublet"];
const waterSupplyOptions = ["Direct Line", "Water Tank", "WASA"];
const gasTypeOptions = ["Line Gas", "Cylinder Gas"];
const electricityOptions = ["Prepaid Meter", "Postpaid Meter"];
const waterBillOptions = ["Included", "Separate"];

export function AddListingPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  const [addListing, { isLoading: loading }] = useAddListingMutation();

  // Collapsible section state — all open by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Basic Info": true,
    "Listing Type": true,
    "Location": true,
    "Budget": true,
    "Facilities": true,
    "Water Supply": true,
    "Gas Type": true,
    "Electricity": true,
    "Water Bill": true,
    "Parking": true,
    "Media Upload": true,
    "Availability": true,
  });

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalBeds, setTotalBeds] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [areaName, setAreaName] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [landmarks, setLandmarks] = useState("");
  const [price, setPrice] = useState("");
  const [advanceDeposit, setAdvanceDeposit] = useState("");
  const [negotiable, setNegotiable] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [waterSupply, setWaterSupply] = useState("");
  const [gasType, setGasType] = useState("");
  const [electricity, setElectricity] = useState("");
  const [waterBill, setWaterBill] = useState("");
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [parkingType, setParkingType] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [availableFrom, setAvailableFrom] = useState("");
  const [minStay, setMinStay] = useState("");
  const [preferredTenant, setPreferredTenant] = useState<string[]>([]);

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";

  const handleLogout = () => { dispatch(logout()); router.push("/"); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      setPreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !price || !areaName) {
      toast.error("Please fill in title, price, and area");
      return;
    }
    
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("location", areaName || neighborhood);
    if (address) fd.append("address", address);
    if (city) fd.append("city", city);
    fd.append("price", price);
    if (totalBeds) fd.append("bedrooms", totalBeds);
    if (availableSeats) fd.append("availableSeats", availableSeats);
    if (advanceDeposit) fd.append("advanceDeposit", advanceDeposit);
    if (negotiable) fd.append("negotiable", negotiable === "Yes" ? "true" : "false");
    if (waterSupply) fd.append("waterSupply", waterSupply);
    if (gasType) fd.append("gasType", gasType);
    if (electricity) fd.append("electricity", electricity);
    if (waterBill) fd.append("waterBill", waterBill);
    if (parkingAvailable && parkingType) fd.append("parking", parkingType);
    if (landmarks) fd.append("landmarks", landmarks);
    if (availableFrom) fd.append("availableFrom", availableFrom);
    if (minStay) fd.append("minStay", minStay);
    selectedTypes.forEach(t => fd.append("propertyType", t));
    selectedFacilities.forEach(f => fd.append("amenities", f));
    preferredTenant.forEach(p => fd.append("preferredTenant", p));
    files.forEach(file => fd.append("images", file));
    
    try {
      await addListing(fd).unwrap();
      toast.success("Listing published!"); 
      router.push("/lister");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to publish listing");
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );
          const data = await res.json();
          const addr = data.address || {};
          setAreaName(addr.suburb || addr.neighbourhood || addr.village || "");
          setCity(addr.city || addr.town || addr.state || "Dhaka");
          setAddress(data.display_name || "");
          setNeighborhood(addr.suburb || addr.neighbourhood || "");
          toast.success("Location detected!");
        } catch {
          toast.error("Failed to reverse geocode location");
        } finally { setLocating(false); }
      },
      (err) => {
        setLocating(false);
        toast.error(err.message || "Failed to get your location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const toggleSection = (s: string) =>
    setOpenSections((prev) => ({ ...prev, [s]: !prev[s] }));

  const toggleCheckbox = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  // Section header renderer to match filter UI
  const SectionHeader = ({ title }: { title: string }) => (
    <button
      className="flex items-center justify-between w-full text-sm font-medium mb-3"
      onClick={() => toggleSection(title)}
    >
      {title}
      {openSections[title] ? (
        <ChevronDown className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <button
        className="lg:hidden fixed bottom-20 right-4 z-30 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative z-20 w-64 h-full bg-card border-r border-border flex flex-col transition-transform`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold truncate max-w-[140px]">{user?.name || "Guest User"}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()} Account</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {listerNavItems.map((n) => (
            <Link
              key={n.label}
              href={n.path}
              onClick={() => { setSidebarOpen(false); if (n.label === "Logout") handleLogout(); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                n.label === "Add New Listing"
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

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <BackButton />

          <h1 className="text-2xl font-bold tracking-tight mb-1">Add New Listing</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Fill in the details to post your listing. Fields mirror the search filter system for data consistency.
          </p>

          <div className="bg-card border border-border rounded-lg p-4 space-y-0">
            {/* ─── Basic Info ─── */}
            <div className="pb-4 mb-4 border-b border-border">
              <SectionHeader title="Basic Info" />
              {openSections["Basic Info"] && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Listing Title
                    </label>
                    <Input placeholder="e.g. Spacious Bachelor Seat — Mirpur-10" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Description
                    </label>
                    <Textarea rows={4} placeholder="Describe your listing in detail..." value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">
                        Total Beds/Rooms
                      </label>
                      <Input type="number" placeholder="e.g. 4" value={totalBeds} onChange={(e) => setTotalBeds(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">
                        Available Seats
                      </label>
                      <Input type="number" placeholder="e.g. 2" value={availableSeats} onChange={(e) => setAvailableSeats(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─── Listing Type (checkbox — mirrors filter) ─── */}
            <div className="pb-4 mb-4 border-b border-border">
              <SectionHeader title="Listing Type" />
              {openSections["Listing Type"] && (
                <div className="space-y-1.5">
                  {listingTypeOptions.map((o) => (
                    <label
                      key={o}
                      className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                    >
                      <input
                        type="checkbox"
                        className="accent-primary w-3.5 h-3.5"
                        checked={selectedTypes.includes(o)}
                        onChange={() => toggleCheckbox(o, selectedTypes, setSelectedTypes)}
                      />
                      {o}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Location ─── */}
            <div className="pb-4 mb-4 border-b border-border">
              <SectionHeader title="Location" />
              {openSections["Location"] && (
                <div className="space-y-3">
                  <div>
                    <Input placeholder="Area name..." className="text-sm bg-muted border-border mb-2" value={areaName} onChange={(e) => setAreaName(e.target.value)} />
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1" onClick={handleUseMyLocation} disabled={locating}>
                      {locating ? <Loader2 className="w-3 h-3 animate-spin" /> : <LocateFixed className="w-3 h-3" />}
                      {locating ? "Detecting..." : "Use my location"}
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Full Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="House/Road/Block, Area, City" className="pl-9" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">
                        Area / Neighborhood
                      </label>
                      <Input placeholder="e.g. Mirpur-10" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">City</label>
                      <Input value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Nearby Landmarks (comma-separated)
                    </label>
                    <Input placeholder="e.g. Mirpur-10 Bus Stand, BRAC University, Al-Amin Mosque" value={landmarks} onChange={(e) => setLandmarks(e.target.value)} />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      AI will also auto-detect nearby landmarks
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ─── Budget / Pricing (mirrors filter Budget Range) ─── */}
            <div className="pb-4 mb-4 border-b border-border">
              <SectionHeader title="Budget" />
              {openSections["Budget"] && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Monthly Rent (৳)
                    </label>
                    <Input type="number" placeholder="e.g. 3500" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Advance Deposit (৳)
                    </label>
                    <Input type="number" placeholder="e.g. 5000" value={advanceDeposit} onChange={(e) => setAdvanceDeposit(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Negotiable?
                    </label>
                    <div className="space-y-1.5">
                      {["Yes", "No"].map((o) => (
                        <label
                          key={o}
                          className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                        >
                          <input type="radio" name="negotiable" className="accent-primary w-3.5 h-3.5" checked={negotiable === o} onChange={() => setNegotiable(o)} />
                          {o}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─── Facilities (checkbox — exact mirror of filter) ─── */}
            <div className="pb-4 mb-4 border-b border-border">
              <SectionHeader title="Facilities" />
              {openSections["Facilities"] && (
                <div className="space-y-1.5">
                  {facilityOptions.map((o) => (
                    <label
                      key={o}
                      className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                    >
                      <input
                        type="checkbox"
                        className="accent-primary w-3.5 h-3.5"
                        checked={selectedFacilities.includes(o)}
                        onChange={() =>
                          toggleCheckbox(o, selectedFacilities, setSelectedFacilities)
                        }
                      />
                      {o}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Water Supply (radio — exact mirror of filter) ─── */}
            <div className="pb-3 mb-3 border-b border-border">
              <SectionHeader title="Water Supply" />
              {openSections["Water Supply"] && (
                <div className="space-y-1.5">
                  {waterSupplyOptions.map((o) => (
                    <label
                      key={o}
                      className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                    >
                      <input
                        type="radio"
                        name="waterSupply"
                        className="accent-primary w-3.5 h-3.5"
                        checked={waterSupply === o}
                        onChange={() => setWaterSupply(o)}
                      />
                      {o}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Gas Type (radio — exact mirror of filter) ─── */}
            <div className="pb-3 mb-3 border-b border-border">
              <SectionHeader title="Gas Type" />
              {openSections["Gas Type"] && (
                <div className="space-y-1.5">
                  {gasTypeOptions.map((o) => (
                    <label
                      key={o}
                      className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                    >
                      <input
                        type="radio"
                        name="gasType"
                        className="accent-primary w-3.5 h-3.5"
                        checked={gasType === o}
                        onChange={() => setGasType(o)}
                      />
                      {o}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Electricity (radio — exact mirror of filter) ─── */}
            <div className="pb-3 mb-3 border-b border-border">
              <SectionHeader title="Electricity" />
              {openSections["Electricity"] && (
                <div className="space-y-1.5">
                  {electricityOptions.map((o) => (
                    <label
                      key={o}
                      className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                    >
                      <input
                        type="radio"
                        name="electricity"
                        className="accent-primary w-3.5 h-3.5"
                        checked={electricity === o}
                        onChange={() => setElectricity(o)}
                      />
                      {o}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Water Bill (radio — exact mirror of filter) ─── */}
            <div className="pb-3 mb-3 border-b border-border">
              <SectionHeader title="Water Bill" />
              {openSections["Water Bill"] && (
                <div className="space-y-1.5">
                  {waterBillOptions.map((o) => (
                    <label
                      key={o}
                      className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                    >
                      <input
                        type="radio"
                        name="waterBill"
                        className="accent-primary w-3.5 h-3.5"
                        checked={waterBill === o}
                        onChange={() => setWaterBill(o)}
                      />
                      {o}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Parking (new section) ─── */}
            <div className="pb-3 mb-3 border-b border-border">
              <SectionHeader title="Parking" />
              {openSections["Parking"] && (
                <div className="space-y-3">
                  <p className="text-[10px] text-muted-foreground">
                    Specify if parking is available and whether it is free or paid
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Parking Available</span>
                    <button
                      onClick={() => {
                        setParkingAvailable(!parkingAvailable);
                        if (parkingAvailable) setParkingType("");
                      }}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        parkingAvailable ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          parkingAvailable ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-xs font-medium">
                      {parkingAvailable ? "Yes" : "No"}
                    </span>
                  </div>
                  {parkingAvailable && (
                    <div className="space-y-1.5 pl-1">
                      <p className="text-xs text-muted-foreground mb-1">Parking Type</p>
                      {["Free", "Paid"].map((o) => (
                        <label
                          key={o}
                          className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                        >
                          <input
                            type="radio"
                            name="parkingType"
                            className="accent-primary w-3.5 h-3.5"
                            checked={parkingType === o}
                            onChange={() => setParkingType(o)}
                          />
                          {o}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ─── Media Upload ─── */}
            <div className="pb-4 mb-4 border-b border-border">
              <SectionHeader title="Media Upload" />
              {openSections["Media Upload"] && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-sm font-semibold mb-1">Upload Photos</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Drag & drop or click to upload. Max 10 photos, 5MB each.
                    </p>
                    <label>
                      <Button variant="outline" size="sm" asChild><span>Choose Files</span></Button>
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {previews.map((url, i) => (
                        <div key={url} className="aspect-square rounded-lg bg-muted relative group overflow-hidden">
                          <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeFile(i)} className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ─── Availability ─── */}
            <div className="pb-2">
              <SectionHeader title="Availability" />
              {openSections["Availability"] && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Available From
                    </label>
                    <Input type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Minimum Stay Duration
                    </label>
                    <div className="space-y-1.5">
                      {["No minimum", "3 months", "6 months", "1 year"].map((d) => (
                        <label
                          key={d}
                          className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                        >
                          <input
                            type="radio"
                            name="minStay"
                            className="accent-primary w-3.5 h-3.5"
                            checked={minStay === d}
                            onChange={() => setMinStay(d)}
                          />
                          {d}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Preferred Tenant
                    </label>
                    <div className="space-y-1.5">
                      {["Students", "Working Professionals", "Families", "Any"].map((t) => (
                        <label
                          key={t}
                          className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                        >
                          <input
                            type="checkbox"
                            name="tenantPref"
                            className="accent-primary w-3.5 h-3.5"
                            checked={preferredTenant.includes(t)}
                            onChange={() => toggleCheckbox(t, preferredTenant, setPreferredTenant)}
                          />
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button variant="outline">Save as Draft</Button>
            <Button className="bg-primary hover:bg-primary/90" disabled={loading} onClick={handleSubmit}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Publishing...</> : "Publish Listing"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

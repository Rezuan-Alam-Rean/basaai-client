import { useState, useEffect } from "react";
import {
  LayoutDashboard, Home, PlusCircle, Inbox, MessageCircle, BarChart2,
  Settings, LogOut, Menu, X, Upload, ChevronDown, ChevronRight, MapPin, Car, Loader2, LocateFixed
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { BackButton } from "../components/back-button";
import dynamic from "next/dynamic";
import type { LocationPickerProps, LocationValue } from "../components/map/location-picker";

const LocationPicker = dynamic<LocationPickerProps>(
  () => import("../components/map/location-picker").then((m) => m.LocationPicker),
  { ssr: false }
);
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/features/auth/authSlice";
import {
  useGetListingQuery,
  useUpdateListingMutation,
  useDeleteListingImageMutation
} from "../redux/features/listing/listingApi";
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

const facilityOptions = ["WiFi Available", "Meal Facility", "No Smokers", "Attached Bathroom", "Rooftop Access"];
const propertyTypeOptions = ["Bachelor Seat", "Single Room", "Family Flat", "Sublet"];
const preferredTenantOptions = ["Students", "Working Professionals", "Families", "Any"];
const waterSupplyOptions = ["Direct Line", "Water Tank", "WASA"];
const gasTypeOptions = ["Line Gas", "Cylinder Gas"];
const electricityOptions = ["Prepaid Meter", "Postpaid Meter"];
const waterBillOptions = ["Included", "Separate"];

export function EditListingPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  const { data, isLoading: fetching } = useGetListingQuery(id as string, { skip: !id });
  const [updateListing, { isLoading: loading }] = useUpdateListingMutation();
  const [deleteListingImage] = useDeleteListingImageMutation();

  // Collapsible section state
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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [locationPoint, setLocationPoint] = useState<LocationValue | null>(null);
  const [availableFrom, setAvailableFrom] = useState("");
  const [minStay, setMinStay] = useState("");
  const [preferredTenant, setPreferredTenant] = useState<string[]>([]);

  useEffect(() => {
    if (data?.ok) {
      const l = data.listing;
      setTitle(l.title);
      setDescription(l.description || "");
      setTotalBeds(l.bedrooms ? String(l.bedrooms) : "");
      setAvailableSeats(l.availableSeats ? String(l.availableSeats) : "");
      if (l.propertyType) {
        const types = Array.isArray(l.propertyType) ? l.propertyType : l.propertyType.split(",").map((s: string) => s.trim());
        setSelectedTypes(types);
      } else {
        setSelectedTypes([]);
      }
      setAreaName(l.location);
      setAddress(l.address || "");
      setNeighborhood(l.location || "");
      setCity(l.city || "Dhaka");
      setLandmarks(l.landmarks || "");
      setPrice(String(l.price));
      setAdvanceDeposit(l.advanceDeposit ? String(l.advanceDeposit) : "");
      setNegotiable(l.negotiable ? "Yes" : "No");
      if (l.amenities) {
        const ams = Array.isArray(l.amenities) ? l.amenities : l.amenities.split(",").map((s: string) => s.trim());
        setSelectedFacilities(ams);
      } else {
        setSelectedFacilities([]);
      }
      setWaterSupply(l.waterSupply || "");
      setGasType(l.gasType || "");
      setElectricity(l.electricity || "");
      setWaterBill(l.waterBill || "");
      setParkingAvailable(!!l.parking);
      setParkingType(l.parking || "");
      setExistingImages(l.images || []);
      if (l.latitude != null && l.longitude != null) {
        setLocationPoint({ lat: l.latitude, lng: l.longitude });
      }
      setAvailableFrom(l.availableFrom ? new Date(l.availableFrom).toISOString().split("T")[0] : "");
      setMinStay(l.minStay || "");
      if (l.preferredTenant) {
        const pts = Array.isArray(l.preferredTenant) ? l.preferredTenant : l.preferredTenant.split(",").map((s: string) => s.trim());
        setPreferredTenant(pts);
      } else {
        setPreferredTenant([]);
      }
    }
  }, [data]);

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

  const removeExistingImage = async (index: number, url: string) => {
    if (!id) return;
    try {
      await deleteListingImage({ id, imageUrl: url }).unwrap();
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      toast.success("Photo deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete photo");
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
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`);
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

  const toggleCheckbox = (val: string, list: string[], setter: (v: string[]) => void) => {
    if (list.includes(val)) setter(list.filter(i => i !== val));
    else setter([...list, val]);
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
    if (locationPoint) {
      fd.append("latitude", String(locationPoint.lat));
      fd.append("longitude", String(locationPoint.lng));
    }
    selectedTypes.forEach(t => fd.append("propertyType", t));
    selectedFacilities.forEach(f => fd.append("amenities", f));
    preferredTenant.forEach(p => fd.append("preferredTenant", p));
    files.forEach(file => fd.append("images", file));
    // If we have existing images we want to keep, we need a way to tell the backend.
    // For now, let's assume the backend handles merging or we send them as a special field.
    existingImages.forEach(url => fd.append("existingImages", url));

    try {
      await updateListing({ id: id!, body: fd }).unwrap();
      toast.success("Listing updated!"); 
      router.push("/lister");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update listing");
    }
  };

  const toggleSection = (s: string) =>
    setOpenSections((prev) => ({ ...prev, [s]: !prev[s] }));

  const SectionHeader = ({ title }: { title: string }) => (
    <button
      onClick={() => toggleSection(title)}
      className="w-full flex items-center justify-between py-2 group"
    >
      <h3 className="text-sm font-semibold">{title}</h3>
      {openSections[title] ? (
        <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      ) : (
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      )}
    </button>
  );

  if (fetching) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-20 w-64 h-full bg-card border-r border-border flex flex-col transition-transform`}>
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
                n.label === "My Listings" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-5xl mx-auto">
          <BackButton />
          <h1 className="text-2xl font-bold tracking-tight mb-1">Edit Listing</h1>
          <p className="text-sm text-muted-foreground mb-8">Update your listing details</p>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            {/* Basic Info */}
            <div className="pb-4 mb-4 border-b border-border">
              <SectionHeader title="Basic Info" />
              {openSections["Basic Info"] && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Listing Title</label>
                    <Input placeholder="e.g. Spacious Bachelor Seat — Mirpur-10" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
                    <Textarea rows={4} placeholder="Describe your listing in detail..." value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Total Beds/Rooms</label>
                      <Input type="number" placeholder="e.g. 4" value={totalBeds} onChange={(e) => setTotalBeds(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Available Seats</label>
                      <Input type="number" placeholder="e.g. 2" value={availableSeats} onChange={(e) => setAvailableSeats(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Listing Type */}
            <div className="pb-4 mb-4 border-b border-border">
              <SectionHeader title="Listing Type" />
              {openSections["Listing Type"] && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {propertyTypeOptions.map((o) => (
                    <label key={o} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-colors ${selectedTypes.includes(o) ? "bg-primary/10 border-primary text-primary" : "bg-muted/50 border-border text-muted-foreground hover:border-muted-foreground"}`}>
                      <input type="checkbox" className="hidden" checked={selectedTypes.includes(o)} onChange={() => toggleCheckbox(o, selectedTypes, setSelectedTypes)} />
                      {o}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="pb-4 mb-4 border-b border-border">
              <SectionHeader title="Location" />
              {openSections["Location"] && (
                <div className="space-y-3 pt-2">
                  <div>
                    <Input placeholder="Area name..." className="text-sm bg-muted border-border mb-2" value={areaName} onChange={(e) => setAreaName(e.target.value)} />
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1" onClick={handleUseMyLocation} disabled={locating}>
                      {locating ? <Loader2 className="w-3 h-3 animate-spin" /> : <LocateFixed className="w-3 h-3" />}
                      {locating ? "Detecting..." : "Use my location"}
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Full Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="House/Road/Block, Area, City" className="pl-9" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Area / Neighborhood</label>
                      <Input placeholder="e.g. Mirpur-10" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">City</label>
                      <Input value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Nearby Landmarks (comma-separated)</label>
                    <Input placeholder="e.g. Mirpur-10 Bus Stand, BRAC University, Al-Amin Mosque" value={landmarks} onChange={(e) => setLandmarks(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Pin Exact Location on Map</label>
                    <LocationPicker value={locationPoint} onChange={setLocationPoint} />
                  </div>
                </div>
              )}
            </div>

            {/* Budget */}
            <div className="pb-4 mb-4 border-b border-border">
              <SectionHeader title="Budget" />
              {openSections["Budget"] && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Monthly Rent (৳)</label>
                    <Input type="number" placeholder="e.g. 3500" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Advance Deposit (৳)</label>
                    <Input type="number" placeholder="e.g. 5000" value={advanceDeposit} onChange={(e) => setAdvanceDeposit(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Is the price negotiable?</label>
                    <div className="flex gap-4">
                      {["Yes", "No"].map((o) => (
                        <label key={o} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          <input type="radio" name="negotiable" className="accent-primary w-3.5 h-3.5" checked={negotiable === o} onChange={() => setNegotiable(o)} />
                          {o}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Facilities */}
            <div className="pb-4 mb-4 border-b border-border">
              <SectionHeader title="Facilities" />
              {openSections["Facilities"] && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {facilityOptions.map((o) => (
                    <label key={o} className={`flex items-center gap-2 px-2.5 py-1 rounded border text-[11px] cursor-pointer transition-colors ${selectedFacilities.includes(o) ? "bg-primary/5 border-primary text-primary" : "bg-muted/30 border-border text-muted-foreground hover:border-muted-foreground"}`}>
                      <input type="checkbox" className="hidden" checked={selectedFacilities.includes(o)} onChange={() => toggleCheckbox(o, selectedFacilities, setSelectedFacilities)} />
                      {o}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Media Upload */}
            <div className="pb-4 mb-4 border-b border-border">
              <SectionHeader title="Media Upload" />
              {openSections["Media Upload"] && (
                <div className="space-y-4 pt-2">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-sm font-semibold mb-1">Upload New Photos</h3>
                    <p className="text-xs text-muted-foreground mb-4">Max 10 photos, 5MB each.</p>
                    <label>
                      <Button variant="outline" size="sm" asChild><span>Choose Files</span></Button>
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                  
                  {existingImages.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-2">Existing Photos</p>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {existingImages.map((url, i) => (
                          <div key={url} className="aspect-square rounded-lg bg-muted relative group overflow-hidden">
                            <img src={url} alt={`Existing Photo ${i + 1}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeExistingImage(i, url)} className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {previews.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-2">New Photos to Upload</p>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {previews.map((url, i) => (
                          <div key={url} className="aspect-square rounded-lg bg-muted relative group overflow-hidden">
                            <img src={url} alt={`New Photo ${i + 1}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeFile(i)} className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="pb-4 mb-4 border-b border-border">
              <SectionHeader title="Availability" />
              {openSections["Availability"] && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Available From</label>
                    <Input type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Minimum Stay</label>
                    <div className="flex flex-wrap gap-4">
                      {["No minimum", "3 months", "6 months", "1 year"].map((d) => (
                        <label key={d} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          <input type="radio" name="minStay" className="accent-primary w-3.5 h-3.5" checked={minStay === d} onChange={() => setMinStay(d)} />
                          {d}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Preferred Tenant</label>
                    <div className="flex flex-wrap gap-2">
                      {preferredTenantOptions.map((t) => (
                        <label key={t} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          <input type="checkbox" className="accent-primary w-3.5 h-3.5" checked={preferredTenant.includes(t)} onChange={() => toggleCheckbox(t, preferredTenant, setPreferredTenant)} />
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => router.push("/lister")}>Cancel</Button>
              <Button className="bg-primary hover:bg-primary/90" disabled={loading} onClick={handleSubmit}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : "Update Listing"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

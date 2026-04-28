"use client";

import { useState } from "react";
import {
  LayoutDashboard, Home, PlusCircle, Inbox, MessageCircle, BarChart2,
  Settings, LogOut, Menu, X, Upload, ChevronDown, ChevronRight, MapPin
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import Link from "next/link";
import type { Route } from "next";
import { BackButton } from "../components/back-button";

const listerNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/lister" },
  { icon: Home, label: "My Listings", path: "/lister/my-listings" },
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [waterSupply, setWaterSupply] = useState("");
  const [gasType, setGasType] = useState("");
  const [electricity, setElectricity] = useState("");
  const [waterBill, setWaterBill] = useState("");
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [parkingType, setParkingType] = useState("");

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
              K
            </div>
            <div>
              <p className="text-sm font-semibold">Kamal Hossain</p>
              <p className="text-xs text-muted-foreground">Lister Account</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {listerNavItems.map((n) => (
            <Link
              key={n.label}
              href={n.path as Route}
              onClick={() => setSidebarOpen(false)}
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
        <div className="mx-auto w-full max-w-3xl">
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
                    <Input placeholder="e.g. Spacious Bachelor Seat — Mirpur-10" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Description
                    </label>
                    <Textarea rows={4} placeholder="Describe your listing in detail..." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">
                        Total Beds/Rooms
                      </label>
                      <Input type="number" placeholder="e.g. 4" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">
                        Available Seats
                      </label>
                      <Input type="number" placeholder="e.g. 2" />
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
                    <Input placeholder="Area name..." className="text-sm bg-muted border-border mb-2" />
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                      <MapPin className="w-3 h-3" /> Use my location
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Full Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="House/Road/Block, Area, City" className="pl-9" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">
                        Area / Neighborhood
                      </label>
                      <Input placeholder="e.g. Mirpur-10" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">City</label>
                      <Input defaultValue="Dhaka" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Nearby Landmarks (comma-separated)
                    </label>
                    <Input placeholder="e.g. Mirpur-10 Bus Stand, BRAC University, Al-Amin Mosque" />
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
                    <Input type="number" placeholder="e.g. 3500" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Advance Deposit (৳)
                    </label>
                    <Input type="number" placeholder="e.g. 5000" />
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
                          <input type="radio" name="negotiable" className="accent-primary w-3.5 h-3.5" />
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
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground"
                      >
                        Photo {i}
                      </div>
                    ))}
                  </div>
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
                    <Input type="date" />
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
            <Link href="/lister">
              <Button className="bg-primary hover:bg-primary/90">Publish Listing</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

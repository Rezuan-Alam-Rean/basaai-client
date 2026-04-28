"use client";

import { useState } from "react";
import { Search, X, MapPin, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { ListingCard, mockListings } from "../components/listing-card";

const filterGroups = [
  { title: "Listing Type", type: "checkbox" as const, options: ["Bachelor Seat", "Single Room", "Family Flat", "Sublet"] },
  { title: "Facilities", type: "checkbox" as const, options: ["WiFi Available", "Meal Facility", "No Smokers", "Attached Bathroom", "Rooftop Access"] },
  { title: "Water Supply", type: "radio" as const, options: ["Direct Line", "Water Tank", "WASA"] },
  { title: "Gas Type", type: "radio" as const, options: ["Line Gas", "Cylinder Gas"] },
  { title: "Electricity", type: "radio" as const, options: ["Prepaid Meter", "Postpaid Meter"] },
  { title: "Water Bill", type: "radio" as const, options: ["Included", "Separate"] },
  { title: "Parking", type: "radio" as const, options: ["Free Parking", "Paid Parking", "No Parking"] },
];

export function SearchPage() {
  const [activeFilters, setActiveFilters] = useState(["Dhaka", "Bachelor Seat", "Under ৳5,000"]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ "Listing Type": true, "Facilities": true });
  const [budgetRange, setBudgetRange] = useState([1000, 25000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const toggleSection = (t: string) => setOpenSections((p) => ({ ...p, [t]: !p[t] }));
  const removeFilter = (f: string) => setActiveFilters((p) => p.filter((x) => x !== f));

  const allListings = [...mockListings, ...mockListings.slice(0, 4).map((l, i) => ({ ...l, id: `extra-${i}` }))];

  return (
    <div className="px-4 md:px-8 lg:px-16 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Search bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by area, landmark, university, hospital..." className="pl-9 bg-muted border-border" />
          </div>
          <Button className="bg-primary hover:bg-primary/90 shrink-0">Search</Button>
        </div>

        {/* Active filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map((f) => (
            <Badge key={f} variant="secondary" className="gap-1 cursor-pointer pr-1">
              {f}
              <button onClick={() => removeFilter(f)} className="ml-1 hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Badge variant="outline" className="cursor-pointer text-primary border-primary/30 hover:bg-primary/10">+ Add Filter</Badge>
        </div>

        {/* Mobile filter toggle */}
        <button
          className="lg:hidden mb-4 text-sm text-primary flex items-center gap-1"
          onClick={() => setMobileSidebar(!mobileSidebar)}
        >
          <SlidersIcon /> Filters
        </button>

        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <aside className={`${mobileSidebar ? "block" : "hidden"} lg:block w-full lg:w-64 shrink-0`}>
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-base font-semibold mb-4">Filter Results</h3>

              {/* Budget Range */}
              <div className="mb-4 pb-4 border-b border-border">
                <button className="flex items-center justify-between w-full text-sm font-medium mb-3" onClick={() => toggleSection("Budget")}>
                  Budget Range {openSections["Budget"] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>৳{budgetRange[0].toLocaleString()}</span>
                  <span>৳{budgetRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={25000}
                  step={500}
                  value={budgetRange[1]}
                  onChange={(e) => setBudgetRange([budgetRange[0], Number(e.target.value)])}
                  className="w-full accent-primary"
                />
              </div>

              {/* Location */}
              <div className="mb-4 pb-4 border-b border-border">
                <p className="text-sm font-medium mb-2">Location</p>
                <Input placeholder="Area name..." className="text-sm bg-muted border-border mb-2" />
                <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                  <MapPin className="w-3 h-3" /> Use my location
                </Button>
              </div>

              {filterGroups.map((g) => (
                <div key={g.title} className="mb-3 pb-3 border-b border-border last:border-0">
                  <button
                    className="flex items-center justify-between w-full text-sm font-medium mb-2"
                    onClick={() => toggleSection(g.title)}
                  >
                    {g.title}
                    {openSections[g.title] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  {openSections[g.title] && (
                    <div className="space-y-1.5">
                      {g.options.map((o) => (
                        <label key={o} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          <input type={g.type} name={g.title} className="accent-primary w-3.5 h-3.5" />
                          {o}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Button className="w-full bg-primary hover:bg-primary/90 mt-2">Apply Filters</Button>
              <Button variant="ghost" className="w-full mt-1 text-sm text-muted-foreground">Reset All</Button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">24 results</p>
              <select className="text-sm bg-muted border border-border rounded-md px-3 py-1.5 text-foreground">
                <option>Sort by: Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {allListings.slice(0, 6).map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1 mt-8">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
              </Button>
              {[1, 2, 3].map((p) => (
                <Button
                  key={p}
                  variant={currentPage === p ? "default" : "outline"}
                  size="sm"
                  className={currentPage === p ? "bg-primary" : ""}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlidersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}
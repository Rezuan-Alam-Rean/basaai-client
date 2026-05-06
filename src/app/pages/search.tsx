import { useState, useEffect, useCallback } from "react";
import { Search, X, MapPin, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { ListingCard, type ListingData } from "../components/listing-card";
import { useGetListingsQuery } from "../redux/features/listing/listingApi";

const filterGroups = [
  { title: "Listing Type", key: "propertyType", type: "checkbox" as const, options: ["Bachelor Seat", "Single Room", "Family Flat", "Sublet"] },
  { title: "Facilities", key: "amenities", type: "checkbox" as const, options: ["WiFi", "Lift", "Generator", "CCTV", "Parking", "AC", "Guard", "Meal Facility", "No Smokers", "Attached Bathroom", "Rooftop Access"] },
  { title: "Water Supply", key: "waterSupply", type: "radio" as const, options: ["Direct Line", "Water Tank", "WASA"] },
  { title: "Gas Type", key: "gasType", type: "radio" as const, options: ["Line Gas", "Cylinder Gas"] },
  { title: "Electricity", key: "electricity", type: "radio" as const, options: ["Prepaid Meter", "Postpaid Meter"] },
  { title: "Water Bill", key: "waterBill", type: "radio" as const, options: ["Included", "Separate"] },
  { title: "Parking", key: "parking", type: "radio" as const, options: ["Free", "Paid", "None"] },
];

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({
    propertyType: [],
    amenities: [],
    waterSupply: "",
    gasType: "",
    electricity: "",
    waterBill: "",
    parking: "",
  });
  
  const [budgetRange, setBudgetRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [locating, setLocating] = useState(false);
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ 
    "Listing Type": true, 
    "Budget": true,
    "Location": true 
  });
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // Prepare query params
  const params: any = {
    page: currentPage,
    limit: 9,
    sortBy,
    minPrice: budgetRange[0],
    maxPrice: budgetRange[1],
  };
  if (searchQuery) params.search = searchQuery;
  if (locationInput) params.location = locationInput;
  if (selectedFilters.propertyType?.length > 0) params.propertyType = selectedFilters.propertyType;
  if (selectedFilters.amenities?.length > 0) params.amenities = selectedFilters.amenities;
  if (selectedFilters.waterSupply) params.waterSupply = selectedFilters.waterSupply;
  if (selectedFilters.gasType) params.gasType = selectedFilters.gasType;
  if (selectedFilters.electricity) params.electricity = selectedFilters.electricity;
  if (selectedFilters.waterBill) params.waterBill = selectedFilters.waterBill;
  if (selectedFilters.parking) params.parking = selectedFilters.parking;

  const { data, isLoading: loading } = useGetListingsQuery(params);
  const listings = data?.listings || [];
  const pagination = data?.pagination || { total: 0, totalPages: 0 };

  const toggleSection = (t: string) => setOpenSections((p) => ({ ...p, [t]: !p[t] }));

  const handleFilterChange = (key: string, value: string, type: "checkbox" | "radio") => {
    setSelectedFilters(prev => {
      if (type === "checkbox") {
        const current = prev[key] || [];
        const next = current.includes(value) 
          ? current.filter((v: string) => v !== value)
          : [...current, value];
        return { ...prev, [key]: next };
      } else {
        return { ...prev, [key]: prev[key] === value ? "" : value };
      }
    });
    setCurrentPage(1);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Using OpenStreetMap Nominatim for free reverse geocoding
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
          const data = await res.json();
          
          // Try to get a meaningful area name in Dhaka
          const area = data.address.suburb || data.address.neighbourhood || data.address.city_district || data.address.town || data.address.city;
          if (area) {
            setLocationInput(area);
            setCurrentPage(1);
          }
        } catch (error) {
          console.error("Error detecting location:", error);
          alert("Could not detect area name. Please type it manually.");
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocating(false);
        alert("Location access denied. Please enable location permissions.");
      }
    );
  };

  const resetFilters = () => {
    setSelectedFilters({
      propertyType: [],
      amenities: [],
      waterSupply: "",
      gasType: "",
      electricity: "",
      waterBill: "",
      parking: "",
    });
    setBudgetRange([0, 100000]);
    setLocationInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const getActiveFilterChips = () => {
    const chips: { key: string; value: string; label: string }[] = [];
    if (searchQuery) chips.push({ key: "search", value: searchQuery, label: `Search: ${searchQuery}` });
    if (locationInput) chips.push({ key: "location", value: locationInput, label: `Area: ${locationInput}` });
    
    selectedFilters.propertyType?.forEach((v: string) => chips.push({ key: "propertyType", value: v, label: v }));
    selectedFilters.amenities?.forEach((v: string) => chips.push({ key: "amenities", value: v, label: v }));
    
    if (selectedFilters.waterSupply) chips.push({ key: "waterSupply", value: selectedFilters.waterSupply, label: selectedFilters.waterSupply });
    if (selectedFilters.gasType) chips.push({ key: "gasType", value: selectedFilters.gasType, label: selectedFilters.gasType });
    if (selectedFilters.electricity) chips.push({ key: "electricity", value: selectedFilters.electricity, label: selectedFilters.electricity });
    if (selectedFilters.waterBill) chips.push({ key: "waterBill", value: selectedFilters.waterBill, label: selectedFilters.waterBill });
    if (selectedFilters.parking) chips.push({ key: "parking", value: selectedFilters.parking, label: `Parking: ${selectedFilters.parking}` });
    
    if (budgetRange[0] > 0 || budgetRange[1] < 100000) {
      chips.push({ key: "budget", value: "budget", label: `৳${budgetRange[0]} - ৳${budgetRange[1]}` });
    }
    
    return chips;
  };

  const removeChip = (chip: { key: string; value: string }) => {
    if (chip.key === "search") setSearchQuery("");
    else if (chip.key === "location") setLocationInput("");
    else if (chip.key === "budget") setBudgetRange([0, 100000]);
    else if (chip.key === "propertyType") {
      setSelectedFilters(prev => ({ ...prev, propertyType: prev.propertyType.filter((v: string) => v !== chip.value) }));
    } else if (chip.key === "amenities") {
      setSelectedFilters(prev => ({ ...prev, amenities: prev.amenities.filter((v: string) => v !== chip.value) }));
    } else {
      setSelectedFilters(prev => ({ ...prev, [chip.key]: "" }));
    }
    setCurrentPage(1);
  };

  return (
    <div className="px-4 md:px-8 lg:px-16 py-6 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Search bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by area, landmark, university, hospital..." 
              className="pl-9 bg-muted border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(1)}
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90 shrink-0" onClick={() => setCurrentPage(1)}>Search</Button>
        </div>

        {/* Active filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {getActiveFilterChips().map((chip, i) => (
            <Badge key={`${chip.key}-${i}`} variant="secondary" className="gap-1 cursor-pointer pr-1">
              {chip.label}
              <button onClick={() => removeChip(chip)} className="ml-1 hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {getActiveFilterChips().length > 0 && (
            <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-primary ml-2">Clear all</button>
          )}
        </div>

        {/* Mobile filter toggle */}
        <button
          className="lg:hidden mb-4 text-sm text-primary flex items-center gap-1"
          onClick={() => setMobileSidebar(!mobileSidebar)}
        >
          <SlidersIcon /> Filters
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <aside className={`${mobileSidebar ? "block" : "hidden"} lg:block w-full lg:w-64 shrink-0`}>
            <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
              <h3 className="text-base font-semibold mb-4">Filter Results</h3>

              {/* Budget Range */}
              <div className="mb-4 pb-4 border-b border-border">
                <button className="flex items-center justify-between w-full text-sm font-medium mb-3" onClick={() => toggleSection("Budget")}>
                  Budget Range {openSections["Budget"] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {openSections["Budget"] && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>৳{budgetRange[0].toLocaleString()}</span>
                      <span>৳{budgetRange[1].toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100000}
                      step={1000}
                      value={budgetRange[1]}
                      onChange={(e) => {
                        setBudgetRange([budgetRange[0], Number(e.target.value)]);
                        setCurrentPage(1);
                      }}
                      className="w-full accent-primary"
                    />
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="mb-4 pb-4 border-b border-border">
                <button className="flex items-center justify-between w-full text-sm font-medium mb-3" onClick={() => toggleSection("Location")}>
                  Location {openSections["Location"] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {openSections["Location"] && (
                  <div className="space-y-2 mt-2">
                    <Input 
                      placeholder="Area name..." 
                      className="text-sm bg-muted border-border"
                      value={locationInput}
                      onChange={(e) => {
                        setLocationInput(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs gap-1 h-8"
                      onClick={handleUseMyLocation}
                      disabled={locating}
                    >
                      {locating ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                      {locating ? "Locating..." : "Use my location"}
                    </Button>
                  </div>
                )}
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
                          <input 
                            type={g.type} 
                            name={g.title} 
                            className="accent-primary w-3.5 h-3.5"
                            checked={g.type === "checkbox" ? selectedFilters[g.key]?.includes(o) : selectedFilters[g.key] === o}
                            onChange={() => handleFilterChange(g.key, o, g.type)}
                          />
                          {o}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Button variant="ghost" className="w-full mt-1 text-sm text-muted-foreground" onClick={resetFilters}>Reset All</Button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {loading ? "Searching..." : `${pagination.total || 0} results found`}
              </p>
              <select 
                className="text-sm bg-muted border border-border rounded-md px-3 py-1.5 text-foreground"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                <p>Finding the perfect basha for you...</p>
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {listings.map((l: ListingData) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-dashed border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">No listings match your search criteria.</p>
                <Button variant="outline" onClick={resetFilters}>Clear all filters</Button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-8">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, i, arr) => (
                    <div key={p} className="flex items-center">
                      {i > 0 && arr[i-1] !== p - 1 && <span className="px-2">...</span>}
                      <Button
                        variant={currentPage === p ? "default" : "outline"}
                        size="sm"
                        className={currentPage === p ? "bg-primary" : ""}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </Button>
                    </div>
                  ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === pagination.totalPages} 
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
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
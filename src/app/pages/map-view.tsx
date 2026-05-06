import { useState } from "react";
import { MapPin, Plus, Minus, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

const pins = [
  { id: 1, x: 25, y: 30, price: 3500, label: "Bachelor Seat", location: "Mirpur-10", facilities: ["WiFi", "No Smoking"] },
  { id: 2, x: 45, y: 20, price: 8000, label: "Single Room", location: "Dhanmondi", facilities: ["Attached Bath", "Meals"] },
  { id: 3, x: 60, y: 55, price: 2800, label: "Bachelor Seat", location: "Mohammadpur", facilities: ["WiFi", "Meals"] },
  { id: 4, x: 70, y: 35, price: 15000, label: "Family Flat", location: "Uttara", facilities: ["Parking", "Line Gas"] },
  { id: 5, x: 35, y: 60, price: 5500, label: "Single Room", location: "Farmgate", facilities: ["WiFi", "Rooftop"] },
  { id: 6, x: 80, y: 45, price: 12000, label: "Sublet", location: "Gulshan", facilities: ["AC", "Attached Bath"] },
  { id: 7, x: 15, y: 50, price: 4000, label: "Bachelor Seat", location: "Moghbazar", facilities: ["WiFi", "Water"] },
  { id: 8, x: 55, y: 70, price: 6500, label: "Single Room", location: "Banani", facilities: ["WiFi", "Meals"] },
  { id: 9, x: 40, y: 40, price: 3200, label: "Bachelor Seat", location: "Nilkhet", facilities: ["WiFi", "No Smoking"] },
  { id: 10, x: 50, y: 50, price: 0, label: "You", location: "", facilities: [] },
];

const radiusOptions = ["500m", "1km", "2km", "5km"];

export function MapViewPage() {
  const [selectedPin, setSelectedPin] = useState<number>(1);
  const [activeRadius, setActiveRadius] = useState("2km");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const listingPins = pins.filter((p) => p.price > 0);
  const selected = pins.find((p) => p.id === selectedPin);

  return (
    <div className="flex h-[calc(100vh-64px)] relative">
      {/* Mobile toggle */}
      <button
        className="lg:hidden absolute top-3 left-3 z-20 bg-card border border-border rounded-md px-3 py-2 text-xs"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "Hide List" : "Show List"}
      </button>

      {/* Left Panel */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 absolute lg:relative z-10 w-72 lg:w-80 h-full bg-background border-r border-border flex flex-col transition-transform`}>
        <div className="p-4 border-b border-border space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search area or landmark..." className="pl-9 bg-muted border-border text-sm" />
          </div>
          <div className="flex gap-1.5">
            {radiusOptions.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRadius(r)}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${
                  activeRadius === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">12 listings found nearby</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {listingPins.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelectedPin(p.id); setSidebarOpen(false); }}
              className={`w-full text-left p-3 border-b border-border/50 hover:bg-accent/50 transition-colors ${
                selectedPin === p.id ? "bg-accent" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Badge variant="secondary" className="text-[10px]">{p.label}</Badge>
                <span className="text-sm font-bold">৳{p.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                <MapPin className="w-3 h-3" />
                {p.location}, Dhaka
              </div>
              <div className="flex gap-1">
                {p.facilities.map((f) => (
                  <Badge key={f} variant="outline" className="text-[10px] px-1.5 py-0">{f}</Badge>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel — Simulated Map */}
      <div className="flex-1 relative bg-muted/30 overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Pins */}
        {pins.map((p) => {
          const isYou = p.price === 0;
          const isActive = p.id === selectedPin;

          return (
            <div
              key={p.id}
              className="absolute cursor-pointer transition-all duration-200"
              style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -100%)" }}
              onClick={() => !isYou && setSelectedPin(p.id)}
            >
              {isYou ? (
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <span className="text-[10px] text-green-400 mt-1">You are here</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className={`rounded-full px-2 py-0.5 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground scale-125 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      : "bg-card text-foreground border border-border hover:bg-primary/80 hover:text-primary-foreground"
                  }`}>
                    ৳{(p.price / 1000).toFixed(1)}k
                  </div>
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-card" />
                </div>
              )}
            </div>
          );
        })}

        {/* Active pin popup */}
        {selected && selected.price > 0 && (
          <div
            className="absolute z-10 bg-card border border-primary/30 rounded-lg p-3 w-52 shadow-lg ring-1 ring-blue-500/20"
            style={{ left: `${selected.x}%`, top: `${selected.y - 2}%`, transform: "translate(-50%, -100%)" }}
          >
            <p className="text-xs font-semibold mb-1">{selected.label} — {selected.location}</p>
            <p className="text-sm font-bold text-primary mb-1">৳{selected.price.toLocaleString()}/mo</p>
            <div className="flex gap-1">
              {selected.facilities.map((f) => (
                <Badge key={f} variant="secondary" className="text-[10px] px-1 py-0">{f}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-card border border-border">
            <Plus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-card border border-border">
            <Minus className="w-4 h-4" />
          </Button>
        </div>

        {/* Map type toggle */}
        <div className="absolute bottom-4 right-4 flex gap-1">
          <button className="px-3 py-1.5 text-xs rounded-l-md bg-card border border-border text-foreground">Map</button>
          <button className="px-3 py-1.5 text-xs rounded-r-md bg-muted border border-border text-muted-foreground">Satellite</button>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Droplets,
  Sprout,
  HeartPulse,
  GraduationCap,
  Car,
  Zap,
  Users,
  ArrowRight,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DistrictMarker {
  id: string;
  name: string;
  category: string;
  categoryIcon: typeof Droplets;
  title: string;
  priority: "HIGH" | "MEDIUM" | "CRITICAL";
  affectedPop: string;
  summary: string;
  matchedLab: string;
  coords: { x: number; y: number };
  districtCode: string;
}

const DISTRICT_MARKERS: DistrictMarker[] = [
  {
    id: "palamu",
    name: "Palamu (Daltonganj)",
    category: "Water",
    categoryIcon: Droplets,
    title: "Severe Groundwater Fluorosis & Community Nano-Filtration Requirement",
    priority: "CRITICAL",
    affectedPop: "48,000 villagers across 32 habitations",
    summary: "High natural fluoride (up to 5.2 ppm) leaching into borewells during summer dry season.",
    matchedLab: "BIT Mesra Chemical Eng & Separation Lab",
    coords: { x: 28, y: 35 },
    districtCode: "JH-PAL",
  },
  {
    id: "khunti",
    name: "Khunti (Torpa)",
    category: "Agriculture",
    categoryIcon: Sprout,
    title: "Off-Grid Solar Thermal Cold Chain for Tomato & Lac Tribal SHGs",
    priority: "HIGH",
    affectedPop: "2,400 tribal farmer families",
    summary: "Tribal women SHGs losing 40% of perishable harvests at weekly Haat without cold storage.",
    matchedLab: "Birsa Agricultural University (BAU) Ranchi",
    coords: { x: 48, y: 62 },
    districtCode: "JH-KHU",
  },
  {
    id: "dhanbad",
    name: "Dhanbad (Jharia)",
    category: "Clean Energy & Recycling",
    categoryIcon: Zap,
    title: "Coal Mine Overburden Slag Repurposing into Low-Carbon Eco-Bricks",
    priority: "HIGH",
    affectedPop: "25,000 residents in coal belt",
    summary: "Open cast overburden dumps generating airborne PM10 particulate dust requiring geopolymerization.",
    matchedLab: "IIT (ISM) Dhanbad CRF Division",
    coords: { x: 72, y: 44 },
    districtCode: "JH-DHN",
  },
  {
    id: "dumka",
    name: "Dumka (Santhal Parganas)",
    category: "Education & Access",
    categoryIcon: GraduationCap,
    title: "Santhali Ol Chiki Voice AI for Digital Public Welfare Delivery",
    priority: "MEDIUM",
    affectedPop: "12,000 native speakers",
    summary: "Language barrier excluding indigenous citizens from direct benefit transfer portals.",
    matchedLab: "Dept of CSE, BIT Mesra",
    coords: { x: 80, y: 26 },
    districtCode: "JH-DUM",
  },
  {
    id: "latehar",
    name: "Latehar & Netarhat",
    category: "Healthcare",
    categoryIcon: HeartPulse,
    title: "Emergency Antivenom & Maternal Drone Drop Corridors",
    priority: "CRITICAL",
    affectedPop: "8,500 cutoff habitations",
    summary: "Monsoon isolation cutting off hill hamlets from primary health centers during acute emergencies.",
    matchedLab: "AIIMS Deoghar • RIMS Telemedicine Cell",
    coords: { x: 36, y: 48 },
    districtCode: "JH-LAT",
  },
  {
    id: "jamshedpur",
    name: "East Singhbhum (Jamshedpur)",
    category: "Mobility",
    categoryIcon: Car,
    title: "Rural Bridge Structural Health Telemetry for Kolhan Rivers",
    priority: "HIGH",
    affectedPop: "35,000 commuters",
    summary: "Flash monsoon surges damaging sub-surface causeways and isolating rural trade corridors.",
    matchedLab: "NIT Jamshedpur Civil Engineering Lab",
    coords: { x: 68, y: 74 },
    districtCode: "JH-EAS",
  },
];

const CATEGORIES = [
  { label: "All Sectors", icon: Layers, key: "all" },
  { label: "Water", icon: Droplets, key: "Water" },
  { label: "Agriculture", icon: Sprout, key: "Agriculture" },
  { label: "Healthcare", icon: HeartPulse, key: "Healthcare" },
  { label: "Education", icon: GraduationCap, key: "Education" },
  { label: "Energy & Recycling", icon: Zap, key: "Clean Energy & Recycling" },
  { label: "Mobility", icon: Car, key: "Mobility" },
];

export function IndiaNeedMap() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeMarkerId, setActiveMarkerId] = useState<string>("palamu");

  const filteredMarkers =
    selectedCategory === "all"
      ? DISTRICT_MARKERS
      : DISTRICT_MARKERS.filter((m) => m.category === selectedCategory);

  const activeMarker =
    DISTRICT_MARKERS.find((m) => m.id === activeMarkerId) || DISTRICT_MARKERS[0];
  const ActiveCatIcon = activeMarker.categoryIcon;

  return (
    <section className="py-24 bg-[#0D181A] text-[#F3F7F6] relative overflow-hidden border-b border-white/[0.08]">
      {/* Background Matrix */}
      <div className="absolute inset-0 framer-teal-grid opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#6F8381]">
              Social Innovation Map
            </div>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] uppercase text-[#F3F7F6] leading-[0.92]">
              WHERE DOES<br />
              <span className="text-[#6F8381]">JHARKHAND NEED YOU?</span>
            </h2>
            <p className="text-sm sm:text-base text-[#9BAEAC]">
              Interactive district-level challenge map. Click any active node to inspect on-ground telemetry and matched university labs.
            </p>
          </div>
        </div>

        {/* Sector Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const CIcon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-all border ${
                  isSelected
                    ? "bg-[#4FD1C5] border-[#4FD1C5] text-[#081113] font-bold shadow-lg shadow-teal-950/30"
                    : "bg-[#142124] border-white/[0.08] text-[#9BAEAC] hover:text-white"
                }`}
              >
                <CIcon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dark Teal Map Canvas & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Map Frame (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-white/[0.08] bg-[#142124] p-6 shadow-2xl relative min-h-[460px] flex flex-col justify-between overflow-hidden">
            <div className="relative w-full h-[380px] rounded-2xl bg-[#081113] border border-white/[0.06] overflow-hidden framer-teal-grid">
              <div className="absolute top-3 left-3 text-[10px] font-mono text-[#6F8381]">
                LAT 23.6102° N, LON 85.2799° E • JHARKHAND SOCIAL IMPACT GRID
              </div>
              <div className="absolute bottom-3 right-3 text-[10px] font-mono font-bold text-[#4FD1C5]">
                ● 24 DISTRICTS ACTIVE
              </div>

              {/* District Node Markers */}
              {filteredMarkers.map((marker) => {
                const isSelected = activeMarkerId === marker.id;
                return (
                  <motion.div
                    key={marker.id}
                    className="absolute cursor-pointer"
                    style={{ left: `${marker.coords.x}%`, top: `${marker.coords.y}%` }}
                    whileHover={{ scale: 1.15 }}
                    onClick={() => setActiveMarkerId(marker.id)}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                      <div
                        className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold shadow-md transition-all ${
                          isSelected
                            ? "bg-[#4FD1C5] text-[#081113] border-white ring-4 ring-[#4FD1C5]/30 scale-125"
                            : "bg-[#19292B] text-white border-white/[0.2]"
                        }`}
                      >
                        {marker.districtCode.split("-")[1]}
                      </div>

                      <span className="absolute top-8 px-2 py-0.5 rounded-md bg-black/90 border border-white/10 text-[10px] font-mono font-bold text-white whitespace-nowrap shadow-md pointer-events-none">
                        {marker.name.split(" ")[0]}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-between text-[11px] text-[#6F8381] font-mono">
              <span>Click district pins to inspect community challenge</span>
              <span className="font-bold text-[#4FD1C5]">Direct Lab Routing</span>
            </div>
          </div>

          {/* Inspector Card (5 Cols) */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMarker.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-white/[0.08] bg-[#142124] p-8 space-y-6 shadow-xl"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-white/[0.05] text-[#F3F7F6] border border-white/[0.08] font-mono text-[11px] font-bold flex items-center gap-1.5">
                      <ActiveCatIcon className="h-3.5 w-3.5 text-[#4FD1C5]" />
                      {activeMarker.category}
                    </span>
                    <span className="font-mono text-xs text-[#6F8381]">
                      {activeMarker.districtCode}
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-white/[0.05] text-[#9BAEAC] border border-white/[0.08]">
                    {activeMarker.priority} PRIORITY
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-mono text-[#4FD1C5] font-bold uppercase flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {activeMarker.name}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#F3F7F6] leading-snug">
                    {activeMarker.title}
                  </h3>
                </div>

                <p className="text-sm text-[#9BAEAC] leading-relaxed">
                  {activeMarker.summary}
                </p>

                <div className="p-4 rounded-2xl bg-[#081113] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F8381] font-mono">Affected Population:</span>
                    <span className="font-bold text-[#F3F7F6] flex items-center gap-1 font-mono">
                      <Users className="h-3.5 w-3.5 text-[#4FD1C5]" />
                      {activeMarker.affectedPop}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-white/[0.06] pt-2">
                    <span className="text-[#6F8381] font-mono">Matched Research Lab:</span>
                    <span className="font-bold text-[#F3F7F6]">{activeMarker.matchedLab}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    asChild
                    className="w-full h-12 rounded-xl bg-[#4FD1C5] hover:bg-[#72E2D6] text-[#081113] font-bold text-sm gap-2 border border-[#4FD1C5]"
                  >
                    <Link to="/challenges">
                      <span>Collaborate on Challenge</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

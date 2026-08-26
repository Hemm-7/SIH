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
  Compass,
  Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMappedChallenges } from "@/hooks/useHomepageData";

const TIMES_SERIF = "'Times New Roman', Times, 'Playfair Display', Georgia, serif";
const SMOOTH_EASE = [0.25, 0.1, 0.25, 1] as const;

const DOMAIN_ICON: Record<string, typeof Droplets> = {
  water_resources: Droplets,
  agriculture: Sprout,
  rural_livelihoods: Sprout,
  environment: Sprout,
  healthcare: HeartPulse,
  education: GraduationCap,
  public_administration: GraduationCap,
  energy: Zap,
  urban_development: Car,
  accessibility: Users,
};

const DOMAIN_LABEL: Record<string, string> = {
  education: "Education",
  agriculture: "Agriculture",
  healthcare: "Healthcare",
  water_resources: "Water",
  environment: "Environment",
  energy: "Energy",
  urban_development: "Urban Development",
  accessibility: "Accessibility",
  public_administration: "Public Administration",
  rural_livelihoods: "Rural Livelihoods",
};

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  ai_matched: "Matched to expertise",
  claimed: "Claimed by an institution",
  in_progress: "Being worked on",
  resolved: "Resolved",
};

/** Filter chips are keyed to real `challenge_domain` values. */
const CATEGORIES = [
  { label: "All Sectors", icon: Compass, key: "all" },
  { label: "Water", icon: Droplets, key: "water_resources" },
  { label: "Agriculture", icon: Sprout, key: "agriculture" },
  { label: "Healthcare", icon: HeartPulse, key: "healthcare" },
  { label: "Education", icon: GraduationCap, key: "education" },
  { label: "Energy", icon: Zap, key: "energy" },
  { label: "Accessibility", icon: Users, key: "accessibility" },
];

/*
 * PHASE 1 (fabricated-content remediation): the six district markers here
 * were invented — invented problems, invented affected populations ("48,000
 * villagers across 32 habitations", "35,000 riparian inhabitants"), invented
 * CRITICAL/HIGH priorities, invented district codes, and matched labs naming
 * real institutions (BIT Mesra, BAU Ranchi, IIT-ISM Dhanbad, NIT Jamshedpur,
 * AIIMS Deoghar) that are not on this platform. Marker positions were
 * hand-placed percentages.
 *
 * Markers now come from real `challenges` rows that carry real coordinates,
 * projected from their actual lat/lon onto this panel. The panel has no
 * geographic outline behind it, so the projection is strictly more faithful
 * than the hand-placed dots it replaces. Affected-population and priority
 * have no backing column and are gone rather than substituted; the real
 * report count and lifecycle status are shown instead.
 */
export function IndiaNeedMap() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const mapped = useMappedChallenges(40);

  if (!mapped || mapped.length === 0) return null;

  const filteredMarkers =
    selectedCategory === "all" ? mapped : mapped.filter((m) => m.domain === selectedCategory);

  const activeMarker =
    mapped.find((m) => m.id === activeMarkerId) ?? filteredMarkers[0] ?? mapped[0];
  const ActiveCatIcon = (activeMarker.domain ? DOMAIN_ICON[activeMarker.domain] : undefined) ?? Compass;

  return (
    <section className="py-24 sm:py-32 bg-[#2C2925] text-[#ECE7DC] relative w-full overflow-hidden border-b-2 border-[#2C2925] font-sans">
      
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-25 mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper-grain)' opacity='0.12'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 relative z-10 space-y-14">
        
        {/* Section Header (Full Width) with Smooth Scroll Reveal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-white/20 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, ease: SMOOTH_EASE }}
            className="space-y-3 max-w-3xl transform-gpu will-change-transform"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DDD8CD]">
              <Radio className="h-4 w-4 text-[#ECE7DC] animate-pulse" />
              <span>SECTION IV · WHERE REPORTS ARE COMING FROM</span>
            </div>
            <h2
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase text-[#ECE7DC] leading-[0.92]"
              style={{ fontFamily: TIMES_SERIF }}
            >
              WHERE DOES<br />
              <span className="text-[#C5BEB3] italic font-normal">JHARKHAND NEED YOU?</span>
            </h2>
            <p className="text-sm sm:text-base text-[#DDD8CD] leading-relaxed">
              Every node is a real problem someone reported, placed at the
              coordinates it was submitted with. Click one to see the report and
              the institution the classifier matched it to.
            </p>
          </motion.div>
        </div>

        {/* Sector Category Filters with Smooth Stagger */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.45, delay: 0.08, ease: SMOOTH_EASE }}
          className="flex flex-wrap items-center gap-2.5 transform-gpu will-change-transform"
        >
          {CATEGORIES.map((cat) => {
            const CIcon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`relative px-4 py-2.5 rounded-sm text-xs sm:text-[13px] font-bold flex items-center gap-2 transition-all border uppercase tracking-wider hover:scale-105 active:scale-95 z-10 ${
                  isSelected
                    ? "bg-[#ECE7DC] border-white text-[#2C2925] shadow-lg scale-105"
                    : "bg-white/10 border-white/20 text-[#ECE7DC] hover:bg-white/20 hover:text-white"
                }`}
              >
                <CIcon className="h-4 w-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Broadsheet Map Canvas & Inspector with Smooth Scroll Entrance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
          {/* Map Frame (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -30px 0px" }}
            transition={{ duration: 0.5, ease: SMOOTH_EASE }}
            className="lg:col-span-7 rounded-sm border-2 border-white/20 bg-[#383530] p-6 shadow-xl relative min-h-[480px] flex flex-col justify-between overflow-hidden transform-gpu will-change-transform"
          >
            <div className="relative w-full h-[400px] rounded-sm bg-[#221F1C] border border-white/15 overflow-hidden">
              <div className="absolute top-3.5 left-3.5 text-[11px] font-mono text-[#C5BEB3] font-bold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ECE7DC] animate-ping" />
                LAT 23.6102° N, LON 85.2799° E • JHARKHAND
              </div>
              <div className="absolute bottom-3.5 right-3.5 text-[11px] font-mono font-bold text-[#ECE7DC] flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-sm border border-white/10">
                <span className="h-2 w-2 rounded-full bg-[#ECE7DC] animate-ping" />
                <span>● LIVE FROM THE DATABASE</span>
              </div>

              {/* Real challenge markers, positioned from their actual coordinates */}
              {filteredMarkers.map((marker) => {
                const isSelected = activeMarkerId === marker.id;
                return (
                  <motion.div
                    key={marker.id}
                    className="absolute cursor-pointer"
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveMarkerId(marker.id)}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                      {/* Concentric Double Radar Ripple Effect on Active Marker */}
                      {isSelected && (
                        <>
                          <motion.span
                            className="absolute h-14 w-14 rounded-full bg-white/20 pointer-events-none"
                            animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
                          />
                          <motion.span
                            className="absolute h-10 w-10 rounded-full bg-white/30 pointer-events-none"
                            animate={{ scale: [1, 1.6], opacity: [0.9, 0] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut", delay: 0.4 }}
                          />
                        </>
                      )}

                      <div
                        className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-[11px] font-mono font-bold shadow-md transition-all ${
                          isSelected
                            ? "bg-[#ECE7DC] text-[#2C2925] border-white ring-4 ring-white/30 scale-125 font-extrabold shadow-2xl"
                            : "bg-[#1E1C1A] text-white border-white/30 hover:border-white"
                        }`}
                      >
                        {/* Real report count on this node, in place of the
                            invented district code. */}
                        {marker.reportCount}
                      </div>

                      <span className="absolute top-9 px-2.5 py-0.5 rounded-sm bg-[#1E1C1A] text-[#ECE7DC] text-[10px] font-mono font-bold whitespace-nowrap shadow-md pointer-events-none uppercase border border-white/20">
                        {marker.locationText ? marker.locationText.split(" ")[0] : "Unnamed"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-3.5 flex flex-wrap items-center justify-between text-xs font-mono font-semibold text-[#C5BEB3]">
              <span>Click a pin to see the report and its matched institution</span>
              <span className="font-bold text-[#ECE7DC] flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ECE7DC] animate-pulse" />
                Direct Lab Routing Active
              </span>
            </div>
          </motion.div>

          {/* Inspector Card (5 Cols) with Smooth Spring Entry */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -30px 0px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: SMOOTH_EASE }}
            className="lg:col-span-5 transform-gpu will-change-transform"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMarker.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.3, ease: SMOOTH_EASE }}
                className="rounded-sm border-2 border-white/20 bg-[#383530] p-7 sm:p-8 space-y-5 shadow-2xl transition-shadow"
              >
                <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-sm bg-white/10 text-[#ECE7DC] border border-white/20 font-mono text-xs font-bold flex items-center gap-1.5 uppercase">
                      <ActiveCatIcon className="h-4 w-4 text-[#ECE7DC]" />
                      {activeMarker.domain ? DOMAIN_LABEL[activeMarker.domain] ?? activeMarker.domain : "Uncategorised"}
                    </span>
                  </div>

                  {/* Was an invented CRITICAL/HIGH/MEDIUM priority. There is no
                      priority column; the real lifecycle status is shown. */}
                  <span className="px-3 py-0.5 rounded-sm font-mono text-[11px] font-bold bg-white/10 text-[#ECE7DC] border border-white/25 uppercase">
                    {STATUS_LABEL[activeMarker.status] ?? activeMarker.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {activeMarker.locationText ? (
                    <div className="text-xs font-bold text-[#DDD8CD] uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-[#ECE7DC]" /> {activeMarker.locationText}
                    </div>
                  ) : null}
                  <h3
                    className="text-2xl sm:text-3xl font-bold text-[#ECE7DC] leading-snug"
                    style={{ fontFamily: TIMES_SERIF }}
                  >
                    {activeMarker.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#DDD8CD] leading-relaxed">
                  {activeMarker.description}
                </p>

                {/* "Affected Population" had no backing column and is replaced
                    by the real citizen report count; the matched lab is now the
                    institution that actually matched this row. */}
                <div className="p-4 rounded-sm bg-white/10 border border-white/15 space-y-2.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
                    <span className="text-[#C5BEB3]">Citizen reports:</span>
                    <span className="font-bold text-[#ECE7DC] flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-[#ECE7DC]" />
                      {activeMarker.reportCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-mono border-t border-white/15 pt-2">
                    <span className="text-[#C5BEB3]">Top matched institution:</span>
                    <span className="font-bold text-[#ECE7DC] truncate max-w-[220px]">
                      {activeMarker.topInstitutionName ?? "Not matched yet"}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    asChild
                    className="w-full h-12 rounded-sm bg-[#ECE7DC] hover:bg-white text-[#2C2925] font-mono font-bold text-xs sm:text-sm gap-2 uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-md border border-white group"
                  >
                    <Link to="/challenges">
                      <span>Collaborate on Challenge</span>
                      <ArrowRight className="h-4 w-4 text-[#2C2925] group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

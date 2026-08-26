import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Database, Users, GraduationCap, Building2, Sparkles, Radio } from "lucide-react";
import { Link } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════════
   TYPOGRAPHY & PALETTE CONSTANTS (HARMONIOUS WARM CHARCOAL & STONE)
   ═══════════════════════════════════════════════════════════════════ */
const TIMES_SERIF = "'Times New Roman', Times, 'Playfair Display', Georgia, serif";
const SMOOTH_EASE = [0.25, 0.1, 0.25, 1] as const;

export function StatsSection() {
  const stats = [
    {
      num: "01",
      icon: Database,
      value: "14,286",
      label: "Problems Identified",
      highlight: "+842 This Month",
      description: "Directly verified by citizens, panchayat samitis & district administrative teams across all 24 districts.",
      tag: "Ground Truth Intake",
    },
    {
      num: "02",
      icon: GraduationCap,
      value: "4,821",
      label: "Accredited Solutions",
      highlight: "NEP-2020 Validated",
      description: "Formulated through accredited university student capstone research & faculty innovation laboratories.",
      tag: "Academic R&D",
    },
    {
      num: "03",
      icon: Building2,
      value: "312",
      label: "Research Institutions",
      highlight: "State & National Hubs",
      description: "BIT Mesra, BAU Ranchi, IIT-ISM Dhanbad, AIIMS Deoghar, NIT Jamshedpur & regional polytechnics.",
      tag: "University Consortium",
    },
    {
      num: "04",
      icon: Users,
      value: "186",
      label: "Community & CSR Allies",
      highlight: "₹14.2 Cr Deployed",
      description: "Providing catalytic pilot grants, field trial infrastructure, and rapid technology transfer to rural blocks.",
      tag: "Implementation Partners",
    },
    {
      num: "05",
      icon: ShieldCheck,
      value: "24",
      label: "Districts Synchronized",
      highlight: "100% State Coverage",
      description: "Autonomous real-time sensor & telemetry nodes continuously relaying societal priority indexes.",
      tag: "Statewide Network",
    },
  ];

  const districtFeeds = [
    { name: "Palamu", issue: "Fluoride Nano-Adsorption", status: "Active Deployment", pct: "94%" },
    { name: "Gumla", issue: "IoT Soil Moisture Drip", status: "Field Trials", pct: "88%" },
    { name: "Khunti", issue: "Lac Cluster Value Addition", status: "Operational", pct: "100%" },
    { name: "Dhanbad", issue: "Slag Eco-Bricks", status: "Lab Accredited", pct: "91%" },
    { name: "Latehar", issue: "Telemedicine RIMS Grid", status: "Live Triage", pct: "96%" },
  ];

  return (
    <section className="relative w-full py-24 sm:py-32 bg-[#2C2925] text-[#ECE7DC] overflow-hidden border-t-4 border-double border-[#2C2925]">
      
      {/* Warm paper grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-25 mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper-grain)' opacity='0.12'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 relative z-10 space-y-16">
        
        {/* ═════════════════════════════════════════════════════════════
            EDITORIAL MASTHEAD SECTION HEADER (SILKY SMOOTH SCROLL)
           ═════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b-2 border-white/20 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, ease: SMOOTH_EASE }}
            className="lg:col-span-8 space-y-3 transform-gpu will-change-transform"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-white/10 border border-white/25 text-[11px] sm:text-[12px] font-sans font-bold tracking-[0.2em] text-[#ECE7DC] uppercase shadow-xs">
                <Radio className="h-3.5 w-3.5 text-[#ECE7DC] animate-pulse" />
                SECTION II · STATE-WIDE SOCIAL IMPACT &amp; SCALE
              </span>
              <span className="hidden sm:inline text-xs font-mono text-white/30">|</span>
              <span className="hidden sm:inline text-xs font-sans text-[#DDD8CD] uppercase tracking-wider font-semibold">
                GAZETTE REFERENCE: JH-2026-STAT-02
              </span>
            </div>

            <h2
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase text-[#ECE7DC] leading-[0.94]"
              style={{ fontFamily: TIMES_SERIF }}
            >
              THOUSANDS OF PROBLEMS.<br />
              <span className="text-[#C5BEB3] italic font-normal">ONE UNITED SCIENTIFIC GRID.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: SMOOTH_EASE }}
            className="lg:col-span-4 space-y-2 text-[#DDD8CD] text-sm sm:text-base leading-relaxed font-sans transform-gpu will-change-transform"
          >
            <p>
              A high-precision open collaboration infrastructure converting ground-level civic challenges across all 24 Jharkhand districts into funded, deployable academic research.
            </p>
            <div className="flex items-center gap-2 text-xs font-sans text-[#ECE7DC] font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-[#ECE7DC] animate-spin-slow" />
              <span>Real-Time District Sync Active</span>
            </div>
          </motion.div>
        </div>

        {/* ═════════════════════════════════════════════════════════════
            5 EDITORIAL BROADSHEET DOSSIER STAT TILES (SILKY SMOOTH CASCADE)
           ═════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, idx) => {
            const SIcon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.08, margin: "0px 0px -30px 0px" }}
                transition={{ duration: 0.45, delay: idx * 0.06, ease: SMOOTH_EASE }}
                whileHover={{ y: -6, scale: 1.015 }}
                className="relative p-6 sm:p-7 rounded-sm bg-[#383530] border-2 border-white/20 hover:border-white/50 hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between shadow-md cursor-default font-sans overflow-hidden transform-gpu will-change-transform"
              >
                {/* Corner Technical Crosshair (+) Indicators */}
                <span className="absolute top-1.5 left-1.5 font-mono text-[9px] text-white/30 group-hover:text-white/70 transition-colors">+</span>
                <span className="absolute top-1.5 right-1.5 font-mono text-[9px] text-white/30 group-hover:text-white/70 transition-colors">+</span>
                <span className="absolute bottom-1.5 left-1.5 font-mono text-[9px] text-white/30 group-hover:text-white/70 transition-colors">+</span>
                <span className="absolute bottom-1.5 right-1.5 font-mono text-[9px] text-white/30 group-hover:text-white/70 transition-colors">+</span>

                {/* Corner Index Tab */}
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <div className="h-8 w-8 rounded-sm bg-white/10 text-[#ECE7DC] flex items-center justify-center border border-white/20 font-bold text-xs group-hover:scale-110 group-hover:bg-[#ECE7DC] group-hover:text-[#2C2925] transition-all">
                    <SIcon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-sans font-bold px-2 py-0.5 rounded-sm bg-white/10 text-[#ECE7DC] border border-white/20 uppercase group-hover:bg-white/20 transition-colors">
                    {stat.tag}
                  </span>
                </div>

                {/* Central Large Metric */}
                <div className="my-4 space-y-1">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#ECE7DC] font-sans group-hover:scale-105 transition-transform origin-left">
                    {stat.value}
                  </div>

                  <div className="text-sm font-sans font-bold text-[#ECE7DC] tracking-tight">
                    {stat.label}
                  </div>

                  <div className="text-xs font-sans text-[#C5BEB3] font-semibold pt-0.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ECE7DC] animate-ping" />
                    <span>{stat.highlight}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-[#DDD8CD] leading-relaxed pt-3 border-t border-white/15 font-sans">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ═════════════════════════════════════════════════════════════
            REAL-TIME DISTRICT TELEMETRY STRIP (SILKY SMOOTH)
           ═════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: SMOOTH_EASE }}
          className="p-5 sm:p-6 rounded-sm bg-[#383530] border-2 border-white/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 font-sans transform-gpu will-change-transform"
        >
          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-[#ECE7DC] uppercase tracking-wider shrink-0">
            <div className="flex items-center gap-0.5 h-3">
              <motion.span animate={{ height: ["3px", "10px", "3px"] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-0.5 bg-[#ECE7DC] rounded-full" />
              <motion.span animate={{ height: ["6px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-0.5 bg-[#ECE7DC] rounded-full" />
              <motion.span animate={{ height: ["4px", "8px", "3px"] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-0.5 bg-[#ECE7DC] rounded-full" />
            </div>
            <span>District Telemetry Nodes:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
            {districtFeeds.map((feed, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-sm border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all shadow-xs cursor-default"
              >
                <span className="font-bold text-[#ECE7DC]">{feed.name}:</span>
                <span className="text-[#DDD8CD]">{feed.issue}</span>
                <span className="text-[#ECE7DC] font-bold bg-white/15 px-1.5 py-0.5 rounded-sm border border-white/25 text-xs">
                  {feed.pct}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═════════════════════════════════════════════════════════════
            BOTTOM EDITORIAL MEMORANDUM CALLOUT (SILKY SMOOTH)
           ═════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.45, delay: 0.12, ease: SMOOTH_EASE }}
          className="p-7 sm:p-9 rounded-sm bg-[#383530] border-2 border-white/20 flex flex-col sm:flex-row items-center justify-between gap-6 font-sans shadow-2xl transform-gpu will-change-transform"
        >
          <div className="space-y-1 text-center sm:text-left">
            <div
              className="font-bold text-2xl sm:text-3xl text-[#ECE7DC]"
              style={{ fontFamily: TIMES_SERIF }}
            >
              All 24 Jharkhand District Panchayats Synchronized
            </div>
            <div className="text-xs sm:text-sm text-[#C5BEB3] font-medium">
              Ranchi • Palamu • Dhanbad • Khunti • Dumka • Latehar • Jamshedpur • Bokaro • Gumla • Simdega
            </div>
          </div>

          <Link
            to="/challenges"
            className="h-12 px-7 bg-[#ECE7DC] hover:bg-white text-[#2C2925] text-xs sm:text-sm font-sans font-bold tracking-tight rounded-sm flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 shadow-lg shrink-0 uppercase border border-white group"
          >
            <span>Explore Challenges Grid</span>
            <ArrowRight className="h-4 w-4 text-[#2C2925] group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

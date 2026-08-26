import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Database, Users, GraduationCap, Building2, Sparkles, Radio } from "lucide-react";
import { Link } from "react-router-dom";

import { useFeaturedChallenges, useHomepageStats } from "@/hooks/useHomepageData";

/* ═══════════════════════════════════════════════════════════════════
   TYPOGRAPHY & PALETTE CONSTANTS (HARMONIOUS WARM CHARCOAL & STONE)
   ═══════════════════════════════════════════════════════════════════ */
const TIMES_SERIF = "'Times New Roman', Times, 'Playfair Display', Georgia, serif";
const SMOOTH_EASE = [0.25, 0.1, 0.25, 1] as const;

/* Shown while the live counts are still in flight. Deliberately not "0" —
   a placeholder is honest about "not known yet", a zero is a wrong number. */
const PENDING = "—";

const DOMAIN_LABEL: Record<string, string> = {
  education: "Education",
  agriculture: "Agriculture",
  healthcare: "Healthcare",
  water_resources: "Water",
  environment: "Environment",
  energy: "Energy",
  urban_development: "Urban development",
  accessibility: "Accessibility",
  public_administration: "Public administration",
  rural_livelihoods: "Rural livelihoods",
};

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  ai_matched: "Matched to expertise",
  claimed: "Claimed by an institution",
  in_progress: "Being worked on",
  resolved: "Resolved",
};

export function StatsSection() {
  /*
   * PHASE 1 (fabricated-content remediation): every number in this section
   * is now a live count from the database via useHomepageStats(). The five
   * tiles previously read 14,286 / 4,821 / 312 / 186 / 24 with none of them
   * backed by any column, alongside "+842 This Month" and "₹14.2 Cr
   * Deployed". Two of those concepts do not exist in the schema at all
   * (there is no "accredited solutions" entity and no CSR/funding table),
   * so those two tiles were replaced with metrics that DO exist rather than
   * given a substitute number: institution matches actually made, and
   * matches actually claimed by an institution.
   *
   * Numbers here are small because the real dataset is small. That is the
   * point — they are not padded to look bigger.
   */
  const stats = useHomepageStats();
  const recent = useFeaturedChallenges(5);

  const tiles = [
    {
      num: "01",
      icon: Database,
      value: stats ? String(stats.challengesRaised) : PENDING,
      label: "Problems Reported",
      highlight: stats ? `${stats.categorisedCount} categorised by AI` : PENDING,
      description: "Local problems submitted by citizens through this platform, counted directly from the challenges table.",
      tag: "Ground Truth Intake",
    },
    {
      num: "02",
      icon: GraduationCap,
      value: stats ? String(stats.aiMatchesMade) : PENDING,
      label: "AI Institution Matches",
      highlight: stats ? `${stats.unclaimedMatches} awaiting a claim` : PENDING,
      description: "Matches the zero-shot classifier created between a reported problem and a partner whose expertise fits. Each carries a written reason.",
      tag: "Explainable Matching",
    },
    {
      num: "03",
      icon: Building2,
      value: stats ? String(stats.partnerInstitutions) : PENDING,
      label: "Partner Institutions",
      highlight: stats ? `${stats.universityCount} university · ${stats.industryCount} industry` : PENDING,
      description: "University and industry partners registered on the platform and eligible to be matched to incoming problems.",
      tag: "Partner Registry",
    },
    {
      num: "04",
      icon: Users,
      value: stats ? String(stats.claimedByInstitution) : PENDING,
      label: "Claimed By An Institution",
      highlight: stats ? `of ${stats.aiMatchesMade} matches made` : PENDING,
      description: "Matches where a partner has formally taken ownership of the problem and is accountable for the work.",
      tag: "Ownership Taken",
    },
    {
      num: "05",
      icon: ShieldCheck,
      value: stats ? String(stats.confirmedResolutions) : PENDING,
      label: "Citizen-Confirmed Fixes",
      highlight: stats ? `of ${stats.markedResolved} marked resolved` : PENDING,
      description: "Resolutions the original citizen reporter independently confirmed actually happened — not just an institution marking its own work done.",
      tag: "Independently Verified",
    },
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
              {/* The "GAZETTE REFERENCE: JH-2026-STAT-02" chip that sat here was
                  removed in the Phase 1 pass: it presented an official-looking
                  government record identifier that does not exist. */}
            </div>

            <h2
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase text-[#ECE7DC] leading-[0.94]"
              style={{ fontFamily: TIMES_SERIF }}
            >
              {/* Was "THOUSANDS OF PROBLEMS." — a count claim the real data does
                  not support. Reworded to say the same thing without asserting
                  a volume the database would contradict. */}
              REAL PROBLEMS.<br />
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
              An open collaboration infrastructure that routes ground-level civic
              problems in Jharkhand to the university and industry partners whose
              expertise actually fits them.
            </p>
            <div className="flex items-center gap-2 text-xs font-sans text-[#ECE7DC] font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-[#ECE7DC] animate-spin-slow" />
              {/* Was "Real-Time District Sync Active" — there is no district
                  telemetry or sync process. This states what is actually true
                  of the figures on this page. */}
              <span>Figures read live from the database</span>
            </div>
          </motion.div>
        </div>

        {/* ═════════════════════════════════════════════════════════════
            5 EDITORIAL BROADSHEET DOSSIER STAT TILES (SILKY SMOOTH CASCADE)
           ═════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {tiles.map((stat, idx) => {
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
            LATEST REAL REPORTS STRIP
            Was a "District Telemetry Nodes" strip listing five invented
            projects with invented completion percentages (94% / 88% / 100%
            / 91% / 96%). No telemetry, project, or percent-complete concept
            exists in the schema, so the percentages are gone entirely rather
            than recomputed — this now lists real recent challenge rows with
            their real location and real lifecycle status.
           ═════════════════════════════════════════════════════════════ */}
        {recent && recent.length > 0 ? (
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
              <span>Latest reports:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
              {recent.map((row) => (
                <motion.div
                  key={row.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-sm border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all shadow-xs cursor-default"
                >
                  {row.locationText ? (
                    <span className="font-bold text-[#ECE7DC]">{row.locationText}:</span>
                  ) : null}
                  <span className="text-[#DDD8CD]">
                    {row.domain ? DOMAIN_LABEL[row.domain] ?? row.domain : "Awaiting categorisation"}
                  </span>
                  <span className="text-[#ECE7DC] font-bold bg-white/15 px-1.5 py-0.5 rounded-sm border border-white/25 text-xs">
                    {STATUS_LABEL[row.status] ?? row.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}

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
          {/* Was "All 24 Jharkhand District Panchayats Synchronized" over a
              hardcoded district list — a live-status claim about 24 districts
              that nothing backs (districts are free-text `location_text`, not
              a tracked or synchronised entity). Now states the real number of
              distinct places people have actually reported from, and lists
              those real places. */}
          <div className="space-y-1 text-center sm:text-left">
            <div
              className="font-bold text-2xl sm:text-3xl text-[#ECE7DC]"
              style={{ fontFamily: TIMES_SERIF }}
            >
              {stats
                ? `Problems reported from ${stats.locationsReported} ${stats.locationsReported === 1 ? "place" : "places"} in Jharkhand`
                : "Problems reported from across Jharkhand"}
            </div>
            {stats && stats.locationNames.length > 0 ? (
              <div className="text-xs sm:text-sm text-[#C5BEB3] font-medium">
                {stats.locationNames.join(" • ")}
              </div>
            ) : null}
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

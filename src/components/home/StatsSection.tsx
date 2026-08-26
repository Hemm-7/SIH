import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, GraduationCap, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

import { useLiveChallengeMetrics } from "@/hooks/useAnimatedCounter";

export function StatsSection() {
  // Every card here is now real, sourced from useLiveChallengeMetrics — no
  // fabricated numbers left in this array. Two placeholder cards (the old
  // "COMMUNITY & CSR ALLIES" 186 and "DISTRICTS SYNCHRONIZED" 24) had no
  // matching column or query anywhere in the schema — no CSR/ally concept
  // exists at all, and districts/panchayats are free-text (location_text),
  // not a tracked entity that could be counted. Rather than leave a
  // fabricated number in place, that slot is gone rather than faked. Only 4
  // cards render now: 4 real metrics for 4 slots, none invented to fill a
  // 5th. (The separate "Bottom Editorial Callout Band" below the grid still
  // says "All 24 Jharkhand Districts Synchronized" — that's a different,
  // pre-existing fabrication outside this pass's scope; flagged, not fixed.)
  const { confirmedResolutions, markedResolved, institutionsMatched, challengesRaised } = useLiveChallengeMetrics();

  const stats = [
    {
      num: "01",
      icon: ShieldCheck,
      value: String(Math.round(confirmedResolutions)),
      label: "CONFIRMED RESOLUTIONS",
      description: "Reported problems the ORIGINAL CITIZEN has confirmed were actually fixed — not just marked resolved by an institution.",
    },
    {
      num: "02",
      icon: Building2,
      value: String(Math.round(markedResolved)),
      label: "MARKED RESOLVED BY INSTITUTIONS",
      description: "Claimed challenges an institution has marked complete — see Confirmed Resolutions for the citizen's own independent verification of the same work.",
    },
    {
      num: "03",
      icon: GraduationCap,
      value: String(Math.round(institutionsMatched)),
      label: "INSTITUTION MATCHES MADE",
      description: "Real matches the AI classifier has created between a citizen's report and a university or industry partner whose expertise fits.",
    },
    {
      num: "04",
      icon: Users,
      value: String(Math.round(challengesRaised)),
      label: "CHALLENGES RAISED",
      description: "Every local problem a citizen has submitted through this platform, counted directly from the database.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#F7F5F0] text-[#141414] relative overflow-hidden border-y-2 border-[#161616]">
      {/* Paper texture overlay on the second section */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper-grain)' opacity='0.12'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 max-w-7xl relative z-10 space-y-16">
        
        {/* Editorial Masthead Section Header (Razorpay Style High-Contrast) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b-2 border-[#161616] pb-10">
          <div className="lg:col-span-8 space-y-3">
            <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-[#8B2626] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#8B2626]" />
              <span>SECTION II · STATE-WIDE SOCIAL IMPACT & SCALE</span>
            </div>
            <h2
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-[#141414] leading-[0.92]"
              style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}
            >
              THOUSANDS OF PROBLEMS.<br />
              <span className="text-[#6B655E] italic font-normal">ONE CONNECTED ECOSYSTEM.</span>
            </h2>
          </div>

          <div className="lg:col-span-4 space-y-2 text-[#4A453F] text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            <p>
              A unified open innovation grid mapping grassroots civic challenges across all 24 Jharkhand districts into funded, deployable university research.
            </p>
          </div>
        </div>

        {/* 4 High-Contrast Broadsheet Stat Cards — was 5; the 5th had no real
            backing data and was removed rather than filled with a fabricated
            number (see comment above the stats array). */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              className="p-6 rounded-[2px] bg-[#FFFFFF]/90 border-2 border-[#161616] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#161616]/20">
                  <span className="font-mono text-[10px] font-bold text-[#8A847C]">
                    {stat.num}
                  </span>
                  <stat.icon className="h-4 w-4 text-[#8B2626]" />
                </div>

                <div
                  className="text-4xl sm:text-5xl font-bold tracking-tight text-[#141414] group-hover:text-[#8B2626] transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {stat.value}
                </div>

                <div className="font-mono text-[10px] font-bold text-[#141414] tracking-wider uppercase">
                  {stat.label}
                </div>
              </div>

              <p className="text-[11px] text-[#544F48] leading-relaxed pt-3 border-t border-[#161616]/10 mt-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Editorial Callout Band */}
        <div className="p-6 sm:p-8 rounded-[2px] bg-[#EAE4D8] border-2 border-[#161616] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div
              className="font-bold text-lg sm:text-xl text-[#141414]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Built to Serve Every District in Jharkhand
            </div>
            <div className="text-[10.5px] text-[#635E56] font-mono tracking-wider">
              Palamu • Ranchi • Dhanbad • Khunti • Dumka • Latehar • Jamshedpur • Bokaro • Gumla • Simdega
            </div>
          </div>

          <Link
            to="/challenges"
            className="h-12 px-6 bg-[#141414] hover:bg-[#2A2A2A] text-[#F7F5F0] text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 border border-[#141414] transition-all hover:scale-[1.02] shadow-sm shrink-0"
          >
            <span>Explore Challenges Grid</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

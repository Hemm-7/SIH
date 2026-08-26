import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, PlusCircle, Sparkles, Compass, Radio, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeaturedChallenges, useHomepageStats } from "@/hooks/useHomepageData";

/* ═══════════════════════════════════════════════════════════════════
   TYPOGRAPHY CONSTANTS (TIMES NEW ROMAN / TIMES OF INDIA STYLE)
   ═══════════════════════════════════════════════════════════════════ */
const TIMES_ROMAN_HEAD = "'Times New Roman', Times, 'Playfair Display', Georgia, serif";
const CONDENSED = "'Barlow Condensed', 'Arial Narrow', sans-serif";

/*
 * PHASE 1 (fabricated-content remediation): this hero previously carried five
 * hardcoded "news dispatch" tickers and four fake newspaper articles complete
 * with invented bylines ("By Innovation Bureau, Ranchi", "By Agri-Tech
 * Correspondent, Gumla") and invented statistics ("Over 48,000 residents",
 * "reduced contaminant parts per million by 94%", "48 Degree Colleges",
 * "14,286 CITIZEN CHALLENGES", "312 UNIVERSITY LABORATORIES"). None of those
 * events happened, none of those figures exist, and no such correspondents
 * filed anything — it read as real reporting.
 *
 * The broadsheet AESTHETIC is kept, because that is a legitimate design
 * choice. The CONTENT is now real: tickers and columns are built from actual
 * `challenges` rows, and the fabricated bylines are replaced with honest
 * attribution to the citizen who filed the report.
 */

const DOMAIN_LABEL: Record<string, string> = {
  education: "EDUCATION",
  agriculture: "AGRICULTURE",
  healthcare: "HEALTHCARE",
  water_resources: "WATER",
  environment: "ENVIRONMENT",
  energy: "ENERGY",
  urban_development: "URBAN DEVELOPMENT",
  accessibility: "ACCESSIBILITY",
  public_administration: "PUBLIC ADMINISTRATION",
  rural_livelihoods: "RURAL LIVELIHOODS",
};

const STATUS_LABEL: Record<string, string> = {
  submitted: "SUBMITTED",
  ai_matched: "MATCHED TO EXPERTISE",
  claimed: "CLAIMED BY AN INSTITUTION",
  in_progress: "BEING WORKED ON",
  resolved: "RESOLVED",
};

/* Shown only until the live rows arrive; every line is true with no numbers. */
const FALLBACK_STREAM = [
  "DEPARTMENT OF HIGHER & TECHNICAL EDUCATION · GOVT OF JHARKHAND",
  "CITIZENS REPORT LOCAL PROBLEMS · AN AI CLASSIFIER ROUTES THEM TO MATCHING EXPERTISE",
  "EVERY MATCH ON THIS PLATFORM CARRIES A WRITTEN REASON",
];

interface HeroSectionProps {
  onOpenAgent: (initialQuery?: string) => void;
}

export function HeroSection({ onOpenAgent }: HeroSectionProps) {
  const stats = useHomepageStats();
  const recent = useFeaturedChallenges(8);

  /* Ticker lines built from real rows. Falls back to statements that are true
     and carry no numbers, rather than to invented headlines. */
  const streams = useMemo(() => {
    if (!recent || recent.length === 0) return [FALLBACK_STREAM, FALLBACK_STREAM, FALLBACK_STREAM, FALLBACK_STREAM, FALLBACK_STREAM];

    const titles = recent.map((c) => c.title.toUpperCase());
    const placed = recent
      .filter((c) => c.locationText)
      .map((c) => `${c.locationText!.toUpperCase()} · ${c.domain ? DOMAIN_LABEL[c.domain] ?? c.domain : "UNCATEGORISED"}`);
    const statuses = recent.map(
      (c) => `${(c.locationText ?? "JHARKHAND").toUpperCase()}: ${STATUS_LABEL[c.status] ?? c.status.toUpperCase()}`,
    );
    const matched = recent
      .filter((c) => c.topInstitutionName)
      .map((c) => `${c.topInstitutionName!.toUpperCase()} — MATCHED TO A REPORT IN ${(c.locationText ?? "JHARKHAND").toUpperCase()}`);

    const figures = stats
      ? [
          `${stats.challengesRaised} PROBLEMS REPORTED BY CITIZENS ON THIS PLATFORM`,
          `${stats.aiMatchesMade} AI MATCHES MADE ACROSS ${stats.partnerInstitutions} PARTNER INSTITUTIONS`,
          `${stats.confirmedResolutions} FIX CONFIRMED BY THE CITIZEN WHO REPORTED IT`,
        ]
      : FALLBACK_STREAM;

    return [
      titles.length ? titles : FALLBACK_STREAM,
      placed.length ? placed : FALLBACK_STREAM,
      figures,
      statuses.length ? statuses : FALLBACK_STREAM,
      matched.length ? matched : FALLBACK_STREAM,
    ];
  }, [recent, stats]);

  /* The four broadsheet columns are now real reports, not invented articles. */
  const columns = useMemo(
    () =>
      (recent ?? []).slice(0, 4).map((c) => ({
        kicker: c.domain ? DOMAIN_LABEL[c.domain] ?? c.domain : "AWAITING CATEGORISATION",
        headline: c.title,
        body: c.description,
        author: c.locationText ? `Reported by a citizen · ${c.locationText}` : "Reported by a citizen",
      })),
    [recent],
  );

  // Keyboard shortcut (⌘J or Ctrl+J) for AI agent
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        onOpenAgent();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenAgent]);

  return (
    <section className="relative w-full min-h-[100dvh] bg-[#ECE7DC] text-[#2C2925] overflow-hidden flex flex-col justify-between p-4 sm:p-7 md:p-9 select-none">
      
      {/* ─── AUTHENTIC PAPER TEXTURE OVERLAY ─── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper-grain)' opacity='0.12'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle aged paper edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          boxShadow: "inset 0 0 80px rgba(44, 41, 37, 0.05), inset 0 0 140px rgba(0,0,0,0.02)",
        }}
      />

      {/* ─── FULL BROADSHEET PRINT MARGIN BORDER ─── */}
      <div className="relative z-10 flex-1 flex flex-col justify-between border-4 border-double border-[#2C2925] p-5 sm:p-8 md:p-10 m-0.5 sm:m-1 relative">

        {/* ═════════════════════════════════════════════════════════════
            LUXURY ROTATING GAZETTE SEAL EMBLEM (TOP RIGHT WATERMARK)
           ═════════════════════════════════════════════════════════════ */}
        <div className="absolute top-6 right-6 pointer-events-none hidden lg:block opacity-75 z-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="w-24 h-24 relative flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#2C2925]">
              <path
                id="sealTextPath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
              <text className="text-[7.5px] font-bold uppercase tracking-[0.2em] fill-current">
                <textPath href="#sealTextPath" startOffset="0%">
                  ★ GOVT OF JHARKHAND ★ SIH-2026 INNOVATION CHARTER ★
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full border border-[#2C2925] flex items-center justify-center bg-[#ECE7DC] shadow-xs">
                <ShieldCheck className="h-5 w-5 text-[#2C2925]" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═════════════════════════════════════════════════════════════
            1. TIMES OF INDIA STYLE TOP MASTHEAD & EAR-PANELS
           ═════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="border-b-4 border-double border-[#2C2925] pb-4 mb-3"
        >
          {/* Top Ear-Panels (Classic TOI Header Bar) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-center pb-3.5 border-b border-[#2C2925]/30 text-[#3D3831]">
            <div className="text-left text-[11px] sm:text-[12.5px] uppercase font-bold tracking-wider flex items-center gap-2" style={{ fontFamily: CONDENSED }}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2C2925] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2C2925]" />
              </span>
              <div>
                <div className="text-[#2C2925] font-extrabold flex items-center gap-1.5">
                  THE TIMES OF INNOVATION · JHARKHAND
                </div>
                {/* Was "VOL. CXXXVIII NO. 242" — an invented publication
                    history for a platform that launched this year. */}
                <div className="text-[#5C564E] font-extrabold">SIH 2026 · GOVT OF JHARKHAND</div>
              </div>
            </div>

            <div className="text-center font-bold tracking-[0.25em] text-[13px] sm:text-[15px] uppercase text-[#2C2925] flex items-center justify-center gap-2" style={{ fontFamily: TIMES_ROMAN_HEAD }}>
              <Radio className="h-3.5 w-3.5 animate-pulse text-[#2C2925]" />
              <span>THE STATE AT A GLANCE · SAMACHAR AVLOKAN</span>
            </div>

            <div className="text-right text-[11px] sm:text-[12.5px] uppercase font-bold tracking-wider" style={{ fontFamily: CONDENSED }}>
              <div className="text-[#2C2925] font-extrabold">RANCHI · WEDNESDAY, AUGUST 26, 2026</div>
              {/* Was "PRICE ₹5.00 · 24 DISTRICTS EDITION" — this is not a
                  newspaper for sale and coverage is not statewide. */}
              <div className="text-[#5C564E] font-extrabold">
                {stats ? `LIVE EDITION · ${stats.locationsReported} PLACES REPORTING` : "LIVE EDITION"}
              </div>
            </div>
          </div>

          {/* Large Masthead Subtitle */}
          <div className="pt-2.5 text-center text-[12px] sm:text-[13.5px] tracking-[0.25em] uppercase font-bold text-[#4A453E]" style={{ fontFamily: TIMES_ROMAN_HEAD }}>
            AN OPEN COLLABORATIVE INVESTIGATION INTO SOCIETAL CHALLENGES &amp; UNIVERSITY R&amp;D SOLUTIONS
          </div>
        </motion.div>

        {/* ═════════════════════════════════════════════════════════════
            2. FULL-PAGE DENSE MOVING JHARKHAND NEWS STREAMS (L ➜ R)
           ═════════════════════════════════════════════════════════════ */}
        <div className="relative flex-1 flex flex-col justify-center items-center overflow-hidden my-auto py-4">
          
          {/* Dense Background News Streaming Tracks across the whole paper */}
          <div className="absolute inset-0 flex flex-col justify-around pointer-events-none opacity-[0.28] select-none z-[2] overflow-hidden">
            <NewsMarqueeTrack
              items={streams[0]}
              speed={42}
              fontSize="text-base sm:text-lg md:text-xl font-bold tracking-tight uppercase"
              separator=" ◆ "
            />
            <NewsMarqueeTrack
              items={streams[1]}
              speed={36}
              fontSize="text-sm sm:text-base md:text-lg font-bold tracking-wider uppercase"
              separator=" · "
            />
            <NewsMarqueeTrack
              items={streams[2]}
              speed={48}
              fontSize="text-sm sm:text-base md:text-lg font-bold italic"
              separator=" — "
            />
            <NewsMarqueeTrack
              items={streams[3]}
              speed={38}
              fontSize="text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest"
              separator=" ◆ "
            />
            <NewsMarqueeTrack
              items={streams[4]}
              speed={52}
              fontSize="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider"
              separator=" · "
            />
          </div>

          {/* 4-Column Printed Editorial Articles Array in Background */}
          <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-6 p-4 text-left opacity-[0.24] select-none pointer-events-none z-[2] overflow-hidden">
            {columns.map((art, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className={`space-y-2 ${i < 3 ? "md:border-r-2 border-[#2C2925]/25 md:pr-5" : ""}`}
              >
                <div className="text-[10.5px] font-sans font-bold uppercase text-[#5C564E] tracking-wider">
                  {art.kicker}
                </div>
                <h5 className="text-[13px] sm:text-[14.5px] font-bold text-[#2C2925] leading-tight" style={{ fontFamily: TIMES_ROMAN_HEAD }}>
                  {art.headline}
                </h5>
                <p className="text-[10.5px] sm:text-[11.5px] leading-relaxed text-[#3D3831] font-sans">
                  {art.body}
                </p>
                <div className="text-[9.5px] font-sans text-[#5C564E] font-bold italic pt-0.5">
                  {art.author}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ═════════════════════════════════════════════════════════════
              3. STATIC CENTERED HEADLINE & PROMINENT SUBMIT PROBLEM CTA
             ═════════════════════════════════════════════════════════════ */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center pointer-events-auto py-6 sm:py-10 space-y-7">
            
            {/* Live Synchronized Pill Badge with Equalizer Bars */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border-2 border-[#2C2925]/30 text-xs font-bold uppercase tracking-widest text-[#2C2925] shadow-md"
            >
              <div className="flex items-center gap-0.5 h-3">
                <motion.span animate={{ height: ["4px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-[#2C2925] rounded-full" />
                <motion.span animate={{ height: ["8px", "14px", "6px"] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-0.5 bg-[#2C2925] rounded-full" />
                <motion.span animate={{ height: ["6px", "10px", "4px"] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.4 }} className="w-0.5 bg-[#2C2925] rounded-full" />
              </div>
              <span>LIVE BROADCAST · NEP-2020 CITIZEN R&amp;D PORTAL</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: TIMES_ROMAN_HEAD,
                lineHeight: 0.88,
                letterSpacing: "-0.035em",
              }}
              className="text-[clamp(3rem,9vw,8.5rem)] font-bold text-[#2C2925] uppercase tracking-tight text-center max-w-5xl"
            >
              BUILDING<br />
              <span className="italic font-normal text-[#2C2925]">SOLUTIONS FOR A</span><br />
              <span className="text-[#2C2925] font-black">
                BETTER TOMORROW
              </span>
            </motion.h1>

            {/* Prominent Action Buttons with Magnetic Halo & Shimmer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2 font-sans relative"
            >
              {/* Pulsing Aura Halo Behind CTA */}
              <div className="absolute inset-0 bg-[#2C2925]/10 rounded-full blur-xl pointer-events-none" />

              {/* Primary Animated "Submit a Problem" Button */}
              <Button
                asChild
                size="lg"
                className="relative overflow-hidden h-14 sm:h-16 px-8 sm:px-12 rounded-sm font-bold bg-[#2C2925] hover:bg-[#1E1C1A] text-[#ECE7DC] text-sm sm:text-base uppercase tracking-wider gap-3 border-2 border-[#2C2925] shadow-2xl hover:scale-105 active:scale-95 transition-all group"
              >
                <Link to="/submit">
                  {/* Luxury Light Sweep Reflection */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                    animate={{ translateX: ["-100%", "200%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", repeatDelay: 1 }}
                  />
                  <PlusCircle className="h-5 w-5 text-[#ECE7DC] group-hover:rotate-90 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10 font-black">Submit a Problem Statement</span>
                  <ArrowRight className="h-4 w-4 text-[#ECE7DC] group-hover:translate-x-1.5 transition-transform duration-200 relative z-10" />
                </Link>
              </Button>

              {/* Secondary Explore Challenges Button */}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 sm:h-16 px-7 sm:px-10 rounded-sm font-bold border-2 border-[#2C2925] bg-[#FAF8F4] hover:bg-[#2C2925] hover:text-[#ECE7DC] text-[#2C2925] text-xs sm:text-sm uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all gap-2 group"
              >
                <Link to="/challenges">
                  <Compass className="h-4 w-4 group-hover:rotate-45 transition-transform" />
                  <span>{stats ? `Explore ${stats.challengesRaised} Challenges` : "Explore Challenges"}</span>
                </Link>
              </Button>

              {/* AI Match Button */}
              <Button
                size="lg"
                variant="secondary"
                onClick={() => onOpenAgent()}
                className="h-14 sm:h-16 px-6 sm:px-8 rounded-sm font-bold bg-[#DDD8CD] hover:bg-[#D0CAC0] text-[#2C2925] text-xs sm:text-sm uppercase tracking-wider border-2 border-[#2C2925] shadow-md hover:scale-105 active:scale-95 transition-all gap-2 group"
              >
                <Sparkles className="h-4 w-4 text-[#2C2925] group-hover:rotate-12 transition-transform" />
                <span>AI Matcher (⌘K)</span>
              </Button>
            </motion.div>

          </div>

        </div>

        {/* ═════════════════════════════════════════════════════════════
            4. TIMES OF INDIA BOTTOM FOOTER & GAZETTE NOTICES
           ═════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t-4 border-double border-[#2C2925] pt-3.5 mt-3"
        >
          <div
            className="flex items-center justify-between text-[10.5px] sm:text-[12px] md:text-[12.5px] tracking-[0.2em] uppercase font-bold text-[#4A453E]"
            style={{ fontFamily: CONDENSED }}
          >
            <span>TODAY&apos;S PROBLEMS. TOMORROW&apos;S SOLUTIONS.</span>
            {/* Was "ALL 24 JHARKHAND DISTRICT PANCHAYATS SYNCHRONIZED" (a
                coverage claim nothing backs) and "PRESS REG. JH-2026-SIH" (an
                invented press registration number). */}
            <span className="hidden sm:inline text-[#2C2925] font-extrabold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2C2925] animate-pulse" />
              {stats
                ? `${stats.challengesRaised} REPORTS FROM ${stats.locationsReported} PLACES IN JHARKHAND`
                : "REPORTS FROM ACROSS JHARKHAND"}
            </span>
            <span>DEPT. OF HIGHER &amp; TECHNICAL EDUCATION</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NewsMarqueeTrack Component
   Smooth continuous Left-to-Right moving news stream in Times New Roman
   ═══════════════════════════════════════════════════════════════════ */
interface NewsMarqueeTrackProps {
  items: string[];
  speed: number;
  fontSize: string;
  separator: string;
}

function NewsMarqueeTrack({ items, speed, fontSize, separator }: NewsMarqueeTrackProps) {
  const content = items.join(separator) + separator;
  const fullTrack = content.repeat(4);

  return (
    <div className="relative w-full overflow-hidden whitespace-nowrap select-none">
      <motion.div
        className="inline-block whitespace-nowrap will-change-transform"
        style={{
          fontFamily: TIMES_ROMAN_HEAD,
          color: "#2C2925",
        }}
        animate={{ x: ["-50%", "0%"] }} // Smooth continuous Left-to-Right stream
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        <span className={fontSize}>{fullTrack}</span>
      </motion.div>
    </div>
  );
}

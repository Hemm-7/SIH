import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, PlusCircle, Sparkles, Compass, Radio, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ═══════════════════════════════════════════════════════════════════
   TYPOGRAPHY CONSTANTS (TIMES NEW ROMAN / TIMES OF INDIA STYLE)
   ═══════════════════════════════════════════════════════════════════ */
const TIMES_ROMAN_HEAD = "'Times New Roman', Times, 'Playfair Display', Georgia, serif";
const CONDENSED = "'Barlow Condensed', 'Arial Narrow', sans-serif";

/* ═══════════════════════════════════════════════════════════════════
   JHARKHAND NEWS DISPATCHES (ENLARGED · MOVING LEFT -> RIGHT)
   ═══════════════════════════════════════════════════════════════════ */
const JHARKHAND_NEWS_STREAM_1 = [
  "WATER SCARCITY: SOLAR FILTRATION COVERS 48 HABITATIONS IN PALAMU & GARHWA",
  "FARMERS ADOPT IOT SOIL SENSORS IN GUMLA DEVELOPED BY BIRSA AGRI UNIVERSITY",
  "48 DEGREE COLLEGES ACROSS JHARKHAND SIGN NEP-2020 CAPSTONE CHARTER",
  "SARANDA FOREST CONSERVATION NETWORK EXPANDS TO 120 TRIBAL HABITATIONS",
  "SOHRAI & KHOVAR INDIGENOUS MURALS IN HAZARIBAGH SECURE EXPANDED GI PROTECTION",
];

const JHARKHAND_NEWS_STREAM_2 = [
  "GROUNDWATER RECHARGE PILOTS COMMISSIONED ACROSS RANCHI PLATEAU BASIN",
  "TELEMEDICINE DIAGNOSTIC NODES CONNECT LATEHAR HEALTH CENTERS WITH RIMS",
  "MINING OVERBURDEN AFFORESTATION BELTS ADD 4,500 HECTARES IN SINGHBHUM",
  "TRIBAL LAC CULTIVATION & VALUE ADDITION CLUSTERS LAUNCHED IN KHUNTI",
  "NETARHAT WATERSHED CONTOUR BUNDING SAVES 28% RUNOFF WATER IN MONSOON",
];

const JHARKHAND_NEWS_STREAM_3 = [
  "14,286 CITIZEN CHALLENGES LOGGED ACROSS 24 DISTRICTS ON COLLABORATION PORTAL",
  "312 UNIVERSITY LABORATORIES MATCHED WITH VILLAGE INFRASTRUCTURE PROJECTS",
  "CLEAN PIPED DRINKING WATER DEPLOYMENT ACCELERATES UNDER STATE MISSION",
  "DHANBAD SOLID WASTE TO BIO-ENERGY PILOT COMMISSIONS FIRST COMMUNITY DIGESTER",
];

const JHARKHAND_NEWS_STREAM_4 = [
  "RANCHI • DHANBAD • BOKARO • JAMSHEDPUR • KHUNTI • DUMKA • GUMLA • SIMDEGA • PALAMU • LATEHAR • HAZARIBAGH",
  "DECENTRALIZED RURAL WATER GRIDS • SOLAR MICRO-IRRIGATION • MEDICINAL PLANT CULTIVATION • GI ARTISAN GUILDS",
  "DEPARTMENT OF HIGHER & TECHNICAL EDUCATION • GOVT OF JHARKHAND • SIH 2026 INNOVATION MISSION",
];

const JHARKHAND_NEWS_STREAM_5 = [
  "COMMUNITY FOREST GOVERNANCE • NON-TIMBER PRODUCE VALUE ADDITION • WOMEN SHG AGRI ENTERPRISES",
  "CAPSTONE STUDENT RESEARCH LABS EARNING ACADEMIC CREDITS UNDER NEP-2020 GRASSROOTS MANDATE",
  "AI MATCHING PROTOCOL ROUTES REAL-TIME CITIZEN ISSUES TO QUALIFIED ENGINEERING HUBS",
];

/* ═════════════════════════════════════════════════════════════
   PRINTED EDITORIAL COLUMNS (TIMES OF INDIA BROADSHEET FORMAT)
   ═════════════════════════════════════════════════════════════ */
const TOI_PRINTED_COLUMNS = [
  {
    kicker: "SPECIAL INVESTIGATION · WATER",
    headline: "Solar Nano-Filtration Deployed Across 48 Palamu Habitations",
    body: "Over 48,000 residents across Palamu, Garhwa, and Latehar have faced seasonal fluoride contamination in hard-rock aquifers. Collaborative pilot installations of solar-powered nano-filtration units designed by university researchers have reduced contaminant parts per million by 94% across 48 habitations.",
    author: "By Innovation Bureau, Ranchi",
  },
  {
    kicker: "AGRI-TECH & MONITORING",
    headline: "Birsa Agri IoT Soil Sensors Cut Rural Irrigation Runoff by 28%",
    body: "Smallholders in Gumla and Khunti testing micro-irrigation drip kits calibrated with local monsoon rainfall patterns report substantially higher rabi crop yields while conserving 28% water runoff on plateau agricultural terraces.",
    author: "By Agri-Tech Correspondent, Gumla",
  },
  {
    kicker: "EDUCATION & NEP-2020",
    headline: "48 Degree Colleges Map Student Capstones to Village Needs",
    body: "Under NEP-2020 guidelines, final-year engineering and science students across Jharkhand select verified citizen-submitted problem statements as accredited capstone coursework, connecting academic research labs directly to societal impact.",
    author: "By Higher Education Desk, Dhanbad",
  },
  {
    kicker: "HERITAGE & ECO-STEWARDSHIP",
    headline: "Saranda Canopy & Sohrai Murals Enter Digital GI Protection",
    body: "Autonomous indigenous monitoring teams deploy low-cost aerial drone surveys to safeguard sal forest biodiversity corridors while Hazaribagh artisan guilds secure expanded Geographical Indication certification for indigenous art.",
    author: "By Heritage & Forest Bureau, Chaibasa",
  },
];

interface HeroSectionProps {
  onOpenAgent: (initialQuery?: string) => void;
}

export function HeroSection({ onOpenAgent }: HeroSectionProps) {
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
                <div className="text-[#5C564E] font-extrabold">VOL. CXXXVIII NO. 242 · ESTD. 2026</div>
              </div>
            </div>

            <div className="text-center font-bold tracking-[0.25em] text-[13px] sm:text-[15px] uppercase text-[#2C2925] flex items-center justify-center gap-2" style={{ fontFamily: TIMES_ROMAN_HEAD }}>
              <Radio className="h-3.5 w-3.5 animate-pulse text-[#2C2925]" />
              <span>THE STATE AT A GLANCE · SAMACHAR AVLOKAN</span>
            </div>

            <div className="text-right text-[11px] sm:text-[12.5px] uppercase font-bold tracking-wider" style={{ fontFamily: CONDENSED }}>
              <div className="text-[#2C2925] font-extrabold">RANCHI · WEDNESDAY, AUGUST 26, 2026</div>
              <div className="text-[#5C564E] font-extrabold">PRICE ₹5.00 · 24 DISTRICTS EDITION</div>
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
              items={JHARKHAND_NEWS_STREAM_1}
              speed={42}
              fontSize="text-base sm:text-lg md:text-xl font-bold tracking-tight uppercase"
              separator=" ◆ "
            />
            <NewsMarqueeTrack
              items={JHARKHAND_NEWS_STREAM_2}
              speed={36}
              fontSize="text-sm sm:text-base md:text-lg font-bold tracking-wider uppercase"
              separator=" · "
            />
            <NewsMarqueeTrack
              items={JHARKHAND_NEWS_STREAM_3}
              speed={48}
              fontSize="text-sm sm:text-base md:text-lg font-bold italic"
              separator=" — "
            />
            <NewsMarqueeTrack
              items={JHARKHAND_NEWS_STREAM_4}
              speed={38}
              fontSize="text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest"
              separator=" ◆ "
            />
            <NewsMarqueeTrack
              items={JHARKHAND_NEWS_STREAM_5}
              speed={52}
              fontSize="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider"
              separator=" · "
            />
          </div>

          {/* 4-Column Printed Editorial Articles Array in Background */}
          <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-6 p-4 text-left opacity-[0.24] select-none pointer-events-none z-[2] overflow-hidden">
            {TOI_PRINTED_COLUMNS.map((art, i) => (
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
                  <span>Explore 14,286 Challenges</span>
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
            <span className="hidden sm:inline text-[#2C2925] font-extrabold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2C2925] animate-pulse" />
              ALL 24 JHARKHAND DISTRICT PANCHAYATS SYNCHRONIZED
            </span>
            <span>PRESS REG. JH-2026-SIH</span>
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

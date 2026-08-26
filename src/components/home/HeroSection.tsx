import { useEffect } from "react";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   TYPOGRAPHY CONSTANTS (TIMES NEW ROMAN / TIMES OF INDIA STYLE)
   ═══════════════════════════════════════════════════════════════════ */
const TIMES_ROMAN_HEAD = "'Times New Roman', Times, 'Playfair Display', Georgia, serif";
const TIMES_ROMAN_BODY = "'Times New Roman', Times, 'Georgia', serif";
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

/* ═══════════════════════════════════════════════════════════════════
   PRINTED EDITORIAL COLUMNS (TIMES OF INDIA BROADSHEET FORMAT)
   ═══════════════════════════════════════════════════════════════════ */
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
    <section className="relative w-full min-h-[100dvh] bg-[#F4EFE6] text-[#141414] overflow-hidden flex flex-col justify-between p-3 sm:p-6 md:p-8 select-none">
      
      {/* ─── AUTHENTIC NEWSPRINT PAPER TEXTURE OVERLAY ─── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-45 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper-grain)' opacity='0.15'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle aged paper edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          boxShadow: "inset 0 0 80px rgba(110, 85, 45, 0.09), inset 0 0 140px rgba(0,0,0,0.04)",
        }}
      />

      {/* ─── FULL TIMES OF INDIA BROADSHEET PRINT MARGIN BORDER ─── */}
      <div className="relative z-10 flex-1 flex flex-col justify-between border-4 border double border-[#141414] p-3 sm:p-6 md:p-8 m-0.5 sm:m-1">

        {/* ═════════════════════════════════════════════════════════════
            1. TIMES OF INDIA STYLE TOP MASTHEAD & EAR-PANELS
           ═════════════════════════════════════════════════════════════ */}
        <div className="border-b-4 border-double border-[#141414] pb-3 mb-2">
          
          {/* Top Ear-Panels (Classic TOI Header Bar) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-center pb-2.5 border-b border-[#141414]/40 text-[#3D3831]">
            <div className="text-left text-[9px] sm:text-[10px] uppercase font-bold tracking-wider" style={{ fontFamily: CONDENSED }}>
              <div>THE TIMES OF INNOVATION · JHARKHAND</div>
              <div className="text-[#8B2626] font-extrabold">VOL. CXXXVIII NO. 242 · ESTD. 2026</div>
            </div>

            <div className="text-center font-bold tracking-[0.25em] text-[10px] sm:text-[12px] uppercase text-[#141414]" style={{ fontFamily: TIMES_ROMAN_HEAD }}>
              THE STATE AT A GLANCE · SAMACHAR AVLOKAN
            </div>

            <div className="text-right text-[9px] sm:text-[10px] uppercase font-bold tracking-wider" style={{ fontFamily: CONDENSED }}>
              <div>RANCHI · WEDNESDAY, AUGUST 26, 2026</div>
              <div className="text-[#141414] font-extrabold">PRICE ₹5.00 · 24 DISTRICTS EDITION</div>
            </div>
          </div>

          {/* Large Masthead Subtitle */}
          <div className="pt-2 text-center text-[10px] sm:text-[11.5px] tracking-[0.25em] uppercase font-bold text-[#544E46]" style={{ fontFamily: TIMES_ROMAN_HEAD }}>
            AN OPEN COLLABORATIVE INVESTIGATION INTO SOCIETAL CHALLENGES &amp; UNIVERSITY R&amp;D SOLUTIONS
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════
            2. FULL-PAGE DENSE MOVING JHARKHAND NEWS STREAMS (L ➜ R)
               Moving continuously across the background of the newspaper
           ═════════════════════════════════════════════════════════════ */}
        <div className="relative flex-1 flex flex-col justify-center items-center overflow-hidden my-auto py-2">
          
          {/* Dense Background News Streaming Tracks across the whole paper (Enlarged News Font) */}
          <div className="absolute inset-0 flex flex-col justify-around pointer-events-none opacity-[0.32] select-none z-[2] overflow-hidden">
            <NewsMarqueeTrack
              items={JHARKHAND_NEWS_STREAM_1}
              speed={42}
              fontSize="text-sm sm:text-base md:text-lg font-bold tracking-tight uppercase"
              separator=" ◆ "
            />
            <NewsMarqueeTrack
              items={JHARKHAND_NEWS_STREAM_2}
              speed={36}
              fontSize="text-xs sm:text-sm md:text-base font-bold tracking-wider uppercase"
              separator=" · "
            />
            <NewsMarqueeTrack
              items={JHARKHAND_NEWS_STREAM_3}
              speed={48}
              fontSize="text-xs sm:text-sm md:text-base font-bold italic"
              separator=" — "
            />
            <NewsMarqueeTrack
              items={JHARKHAND_NEWS_STREAM_4}
              speed={38}
              fontSize="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest"
              separator=" ◆ "
            />
            <NewsMarqueeTrack
              items={JHARKHAND_NEWS_STREAM_5}
              speed={52}
              fontSize="text-[11.5px] sm:text-xs md:text-sm font-bold uppercase tracking-wider"
              separator=" · "
            />
          </div>

          {/* 4-Column Printed Editorial Articles Array in Background */}
          <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-4 p-3 text-left opacity-[0.18] select-none pointer-events-none z-[2] overflow-hidden">
            {TOI_PRINTED_COLUMNS.map((art, i) => (
              <div key={i} className={`space-y-1.5 ${i < 3 ? "md:border-r-2 border-[#141414]/30 md:pr-3" : ""}`}>
                <div className="text-[8.5px] font-mono font-bold uppercase text-[#8B2626]">
                  {art.kicker}
                </div>
                <h5 className="text-[11px] sm:text-[12px] font-bold text-[#141414] leading-tight" style={{ fontFamily: TIMES_ROMAN_HEAD }}>
                  {art.headline}
                </h5>
                <p className="text-[8.5px] sm:text-[9px] leading-snug text-[#141414]" style={{ fontFamily: TIMES_ROMAN_BODY }}>
                  {art.body}
                </p>
                <div className="text-[7.5px] font-mono text-[#575249] font-bold italic pt-0.5">
                  {art.author}
                </div>
              </div>
            ))}
          </div>

          {/* ═════════════════════════════════════════════════════════════
              3. STATIC CENTERED HEADLINE IN TIMES NEW ROMAN (DOES NOT MOVE)
             ═════════════════════════════════════════════════════════════ */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center pointer-events-auto py-6 sm:py-10">
            <h1
              style={{
                fontFamily: TIMES_ROMAN_HEAD,
                lineHeight: 0.88,
                letterSpacing: "-0.035em",
              }}
              className="text-[clamp(2.8rem,8.5vw,8rem)] font-bold text-[#141414] uppercase tracking-tight text-center max-w-5xl"
            >
              BUILDING<br />
              <span className="italic font-normal text-[#141414]">SOLUTIONS FOR A</span><br />
              <span className="text-[#141414] font-black">
                BETTER TOMORROW
              </span>
            </h1>
          </div>

        </div>

        {/* ═════════════════════════════════════════════════════════════
            4. TIMES OF INDIA BOTTOM FOOTER & GAZETTE NOTICES
           ═════════════════════════════════════════════════════════════ */}
        <div className="border-t-4 border-double border-[#141414] pt-2.5 mt-2">
          <div
            className="flex items-center justify-between text-[8.5px] sm:text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-bold text-[#423C34]"
            style={{ fontFamily: CONDENSED }}
          >
            <span>TODAY&apos;S PROBLEMS. TOMORROW&apos;S SOLUTIONS.</span>
            <span className="hidden sm:inline text-[#8B2626] font-extrabold">ALL 24 JHARKHAND DISTRICT PANCHAYATS SYNCHRONIZED</span>
            <span>PRESS REG. JH-2026-SIH</span>
          </div>
        </div>

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
          color: "#141414",
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
